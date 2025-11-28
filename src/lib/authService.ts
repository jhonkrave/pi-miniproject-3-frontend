import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  updatePassword,
  verifyBeforeUpdateEmail,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from './firebaseConfig';
import { api, type User } from './api';

/**
 * Service handling authentication logic, bridging Firebase Auth and Backend API.
 */
export const authService = {

  /**
   * Observes authentication state changes.
   * @param callback Function called with the authenticated user (or null)
   * @returns Unsubscribe function
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 1. Get ID Token
          const token = await firebaseUser.getIdToken();
          
          // 2. Create Session on Backend (optional, but good for HTTPOnly cookies)
          try {
            await api.createSession(token);
          } catch (error) {
            console.warn('Failed to create backend session cookie', error);
          }

          // 3. Get Backend Profile
          try {
            const userProfile = await api.getProfile(firebaseUser.uid, token);
            callback(userProfile);
          } catch (error) {
             // If backend profile doesn't exist yet (404), try to auto-register using Firebase data
             if ((error as { status?: number })?.status === 404) {
                 console.log('User profile not found in backend (404), attempting auto-registration...');
                 
                 const displayName = firebaseUser.displayName || 'Nuevo Usuario';
                 const [firstName, ...lastNameParts] = displayName.split(' ');
                 const lastName = lastNameParts.length > 0 ? lastNameParts.join(' ') : ' '; // Ensure lastName is not empty if backend requires it

                 const signupData = {
                     uid: firebaseUser.uid,
                     email: firebaseUser.email || '',
                     firstName: firstName || 'Usuario',
                     lastName: lastName,
                     age: 18 // Default age
                 };

                 try {
                     const signupRes = await api.signup(signupData, token);
                     if (signupRes && signupRes.user) {
                         console.log('Auto-registration successful');
                         callback(signupRes.user);
                         return;
                     }
                 } catch (signupError) {
                     console.error('Auto-registration failed:', signupError);
                 }
             }

             // Fallback to partial user if registration fails or other error
             console.warn('Backend profile fetch failed, using Firebase data', error);
             const partialUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || undefined,
                photoURL: firebaseUser.photoURL || undefined,
                firstName: '', // Will be missing until profile is created
                lastName: '',
                age: undefined,
                createdAt: firebaseUser.metadata.creationTime,
                metadata: {
                    creationTime: firebaseUser.metadata.creationTime,
                    lastSignInTime: firebaseUser.metadata.lastSignInTime,
                }
             };
             callback(partialUser);
          }

        } catch (error) {
          console.error('Error syncing user with backend:', error);
          callback(null);
        }
      } else {
        // 4. Logout from backend (clear cookie)
        try {
             await api.logout();
        } catch { /* ignore */ }
        callback(null);
      }
    });
  },

  /**
   * Login with Google
   */
  async loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },

  /**
   * Login with Facebook
   */
  async loginWithFacebook() {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  },

  /**
   * Login with Email/Password
   */
  async loginWithEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  /**
   * Register with Email/Password
   * Note: This only creates the Firebase User. 
   * You must call api.signup() separately to create the backend profile.
   */
  async registerWithEmail(email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  /**
   * Logout
   */
  async logout() {
    await signOut(auth);
    await api.logout();
  },

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  /**
   * Confirm password reset with oobCode
   */
  async confirmPasswordReset(oobCode: string, newPassword: string) {
    await confirmPasswordReset(auth, oobCode, newPassword);
  },

  /**
   * Update Password (Firebase)
   */
  async updateUserPassword(newPassword: string) {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    await updatePassword(user, newPassword);
  },

  /**
   * Verify Email before Update (Firebase)
   * Sends a verification email to the new address. 
   * The user must click the link to finalize the change.
   */
  async verifyBeforeUpdateEmail(newEmail: string) {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    await verifyBeforeUpdateEmail(user, newEmail);
  },

  /**
   * Apply Action Code (for email verification, password reset, etc.)
   */
  async applyActionCode(actionCode: string) {
      await applyActionCode(auth, actionCode);
  },

  /**
   * Check Action Code (to see what type of action it is)
   */
  async checkActionCode(actionCode: string) {
      return await checkActionCode(auth, actionCode);
  },

  /**
   * Get current Firebase ID Token
   */
  async getIdToken() {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  }
};
