/**
 * Authentication Store using Zustand
 * 
 * This module manages the authentication state for the application, integrating
 * Firebase Authentication with a custom backend API. It handles user authentication,
 * profile management, and maintains synchronization between Firebase Auth state
 * and the backend user profile.
 * 
 * @module useAuthStore
 */

import { create } from 'zustand'
import { auth, googleProvider, facebookProvider } from '../lib/firebaseConfig'
import { api, type User } from '../lib/api'
import { onAuthStateChanged
    , signInWithPopup
    , signOut
    , createUserWithEmailAndPassword
    , signInWithEmailAndPassword
    , EmailAuthProvider
    , linkWithCredential
    } from 'firebase/auth'

/**
 * Authentication store interface
 * 
 * Defines the shape of the authentication store, including user state,
 * registration flags, and authentication methods.
 * 
 * @interface AuthStore
 */
    type AuthStore = {
       /** Current authenticated user object, or null if not authenticated */
       user: User | null,
       /** Whether the user is registered in Firestore/backend */
       isRegisteredFireStore: boolean ,
       /** Whether the user is registered with email/password credentials */
       isregistredwithemailandpassword: boolean,
       /** Whether Firebase has finished initial authentication state check */
       isInitialized: boolean,
       /**
        * Sets the current user in the store
        * @param user - User object to set
        */
       setUser: (user: User) => void,
       /**
        * Sets the Firestore registration status
        * @param isRegisteredFireStore - Registration status flag
        */
       setIsRegisteredFireStore: (isRegisteredFireStore: boolean) => void,
       /**
        * Sets the email/password registration status
        * @param isRegisteredWithEmailAndPassword - Email/password registration status
        */
       setIsRegisteredWithEmailAndPassword: (isRegisteredWithEmailAndPassword: boolean) => void,
       /**
        * Sets the initialization status
        * @param isInitialized - Initialization status flag
        */
       setIsInitialized: (isInitialized: boolean) => void,
       /**
        * Initializes Firebase authentication state observer
        * @returns Unsubscribe function to stop listening to auth state changes
        */
       initAuthObserver: () => () => void,
       /**
        * Signs in the user with Google authentication provider
        * @throws {Error} If authentication fails
        * @returns Promise that resolves when authentication completes
        */
       loginWithGoogle:  () => Promise<void>,
       /**
        * Signs in the user with Facebook authentication provider
        * @throws {Error} If authentication fails
        * @returns Promise that resolves when authentication completes
        */
       loginWithFacebook: () => Promise<void>,
       /**
        * Signs in the user with email and password
        * @param email - User email address
        * @param password - User password
        * @throws {Error} If authentication fails
        * @returns Promise that resolves when authentication completes
        */
       loginWithEmail: (email: string, password: string) =>  Promise<void>,
       /**
        * Registers a new user with email and password
        * Handles email already in use scenarios and attempts to link credentials
        * @param email - User email address
        * @param password - User password
        * @throws {Error} If registration fails or email is already registered with email/password
        * @returns Promise that resolves when registration completes
        */
       registerWithEmail: (email: string, password: string) => Promise<void>,
       /**
        * Completes user registration by creating profile in backend
        * Requires user to be authenticated via Firebase first
        * @param firstName - User's first name
        * @param lastName - User's last name
        * @param age - User's age
        * @param email - User's email address
        * @param password - User's password
        * @returns Promise that resolves when profile is created
        */
       signup: (firstName: string, lastName: string, age: number, email: string, password: string) => Promise<void>,
       /**
        * Retrieves the current user's profile from the backend
        * Merges Firebase Auth data with backend profile data
        * @throws {Error} If profile retrieval fails
        * @returns Promise that resolves when profile is retrieved
        */
       getProfile: () => Promise<void>,
       /**
        * Updates the current user's profile in the backend
        * @param firstName - User's first name
        * @param lastName - User's last name
        * @param age - User's age
        * @param displayName - User's display name (currently unused in implementation)
        * @returns Promise that resolves when profile is updated
        */
       updateProfile: (firstName: string, lastName: string, age: number, displayName: string) => Promise<void>,
       /**
        * Signs out the current user from Firebase
        * Clears user state in the store
        * @returns Promise that resolves when sign out completes
        */
       logout: () => Promise<void> 
    }

    /**
     * Zustand store for authentication state management
     * 
     * Creates a global state store that synchronizes Firebase Authentication
     * with the application's user state and backend profile data.
     */
    const useAuthStore = create<AuthStore>()((set, get) => ({
        user: null,
        setUser: (user: User) => set({ user }),
        isRegisteredFireStore: false,
        setIsRegisteredFireStore: (isRegisteredFireStore: boolean) => set({ isRegisteredFireStore }),
        isregistredwithemailandpassword: false,
        setIsRegisteredWithEmailAndPassword: (isRegisteredWithEmailAndPassword: boolean) => set({ isregistredwithemailandpassword: isRegisteredWithEmailAndPassword }),
        isInitialized: false,
        setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),
        /**
         * Initializes Firebase authentication state observer
         * 
         * Sets up a listener for Firebase auth state changes. When a user is authenticated,
         * it attempts to fetch their profile from the backend and merges it with Firebase
         * authentication data. Sets isInitialized flag to true when the initial check completes.
         * 
         * @returns Unsubscribe function to stop listening to auth state changes
         */
        initAuthObserver: () => {
            const onsuscribe =  onAuthStateChanged(auth, async (user) => {   
                console.log('user auth observer', user);
                
                if (user) {
                    // User is authenticated - attempt to fetch full profile from backend
                    try {
                        const token = await user.getIdToken();
                        const userProfile = await api.getProfile(user.uid, token);
                        console.log('token', token);
       
                        // Merge Firebase auth data with backend profile data
                        set({ user: {
                            uid: user.uid,
                            displayName: user.displayName || userProfile.displayName ,      
                            email: user.email,
                            photoURL: user.photoURL || userProfile.photoURL ,
                            disabled: userProfile.disabled ,
                            emailVerified: userProfile.emailVerified ,
                            createdAt: userProfile.createdAt ,
                            updatedAt: userProfile.updatedAt ,
                            metadata: userProfile.metadata ,
                            firstName: userProfile.firstName ,
                            lastName: userProfile.lastName ,
                            age: userProfile.age ,
                        }});
                        set({ isRegisteredFireStore: true });
                        // Mark as initialized when Firebase finishes verifying the session
                        set({ isInitialized: true });
                    } catch (error) {
                        // If backend fetch fails, use only Firebase auth data
                        set({ user: {
                            uid: user.uid,
                            displayName: user.displayName  || null,      
                            email: user.email,
                            photoURL: user.photoURL ||null,
                            disabled: false,
                            emailVerified: false,
                            createdAt: null,
                            updatedAt: null,
                            metadata: null,
                            firstName: null,
                            lastName: null,
                            age: null,
                        }});
                        set({ isRegisteredFireStore: false });
                        set({ isInitialized: false });   
                    }
                } else {
                    // User is not authenticated - clear user state
                    set({ user: null });
                    set({ isRegisteredFireStore: false });
                }
            });
            return onsuscribe;
        },
        /**
         * Signs in user with Google using popup authentication
         */
        loginWithGoogle: async () => {
            try {
                await signInWithPopup(auth, googleProvider);
            } catch (e: any) {
                console.error('Error en loginWithGoogle:', e);
                throw e; // Re-throw error so component can handle it
            }
        },
        /**
         * Signs in user with Facebook using popup authentication
         */
        loginWithFacebook: async () => {
            try {
                await signInWithPopup(auth, facebookProvider);
            } catch (e: any) {
                console.error('Error en loginWithFacebook:', e);
                throw e; // Re-throw error so component can handle it
            }
        },
        /**
         * Signs in user with email and password
         * Trims whitespace from email and password before authentication
         */
        loginWithEmail: async (email: string, password: string) => {
            try {
             await signInWithEmailAndPassword(auth, email.trim(), password.trim());
             

            } catch (e: any) {
                console.error('Error en loginWithEmail:', e);
                throw e; // Re-throw error so component can handle it
            }
        },
        /**
         * Registers a new user with email and password
         * 
         * Handles complex scenarios:
         * - If email already exists, checks if it has email/password credentials
         * - If credentials exist, throws error asking user to login instead
         * - If credentials don't exist, attempts to link email/password to existing account
         * - Uses Email Enumeration Protection by attempting sign-in to detect account existence
         */
        registerWithEmail: async (email: string, password: string) => {
            try {
                // Try to create account normally
                await createUserWithEmailAndPassword(auth, email, password);
                // Account created successfully
            } catch (error: any) {
                if (error.code === "auth/email-already-in-use") {
                    // Email already exists - check if it has email/password credentials
                    // Due to Email Enumeration Protection, we attempt sign-in to detect account existence
                    let fetchMethods: string[] = [];
                    try {
                        console.log('signInWithEmailAndPassword auth', auth);
                        await signInWithEmailAndPassword(auth, email, password);
                        // If sign-in succeeds, method is 'password'
                        fetchMethods = ['password'];
                    } catch (loginError: any) {
                        if (loginError.code === "auth/wrong-password" || loginError.code === "auth/too-many-requests") {
                            // User exists but password is wrong or account is locked: exists with email/password
                            fetchMethods = ['password'];
                        } else if (loginError.code === "auth/user-not-found") {
                            // User does not exist
                            fetchMethods = [];
                        } else if (loginError.code === "auth/user-disabled") {
                            // User is disabled but exists
                            fetchMethods = ['password'];
                        } else if (loginError.code === "auth/invalid-credential") {
                            // User exists but password is wrong: exists with email/password
                            fetchMethods = ['invalid-credential'];
                        } else {
                            // Other error, re-throw for upper flow to handle
                            throw loginError;
                        }
                    }
                    if (fetchMethods.includes("password")) {
                        // Already has email/password; account may have been created before
                        set({ isregistredwithemailandpassword: true });
                        throw new Error("El correo ya está registrado con email y contraseña. Prueba iniciar sesión.");
                    } else {
                        try {
                            // If no password/email credentials, attempt to link credentials to current user
                            // Generally, user must be authenticated with another method first
                            const credential = EmailAuthProvider.credential(email, password);
                            if (auth.currentUser) {
                                // User is authenticated, attempt to link credentials
                                await linkWithCredential(auth.currentUser, credential);
                            } else {
                                throw new Error("El correo ya está registrado pero no tiene credenciales de contraseña. Por favor inicia sesión con ese método y vuelve a intentar.");
                            }
                        } catch (linkError: any) {
                            console.error(linkError);
                            throw new Error("No se pudo asociar email/password al usuario existente.");
                        }
                    }
                } else {
                    // Different error
                    console.error(error);
                    throw error;
                }
            }
        },
        /**
         * Completes user registration by creating profile in backend
         * 
         * This should be called after Firebase authentication is established.
         * Creates the user profile in the backend Firestore with additional information.
         */
        signup: async (firstName: string, lastName: string, age: number, email: string, password: string) => {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                const userProfile = await api.signup({ firstName, lastName, age, email, password }, token);
                set({ user: {
                    uid: user.uid,
                    displayName: user.displayName,      
                    email: user.email,
                    photoURL: user.photoURL,
                    disabled: userProfile.disabled,
                    emailVerified: userProfile.emailVerified,
                    createdAt: userProfile.createdAt,
                    updatedAt: userProfile.updatedAt,
                    metadata: userProfile.metadata,
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    age: userProfile.age,
                }});
                set({ isRegisteredFireStore: true });
            }
        },
        /**
         * Retrieves current user's profile from backend and merges with Firebase data
         * 
         * Fetches user profile from backend API and merges it with current Firebase
         * authentication data, preserving existing information when available.
         */
        getProfile: async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const token = await user.getIdToken();
                    const userProfile = await api.getProfile(user.uid, token);
                    console.log("user profile getProfile", userProfile);
                    
                    // Get current user from store to preserve existing information
                    const currentUser = get().user;
                    
                    // Merge existing information with new backend information
                    set({ user: {
                        uid: user.uid,
                        displayName: user.displayName || userProfile.displayName || currentUser?.displayName || null,      
                        email: user.email,
                        photoURL: user.photoURL || userProfile.photoURL || currentUser?.photoURL || null,
                        disabled: userProfile.disabled ?? currentUser?.disabled ?? false,
                        emailVerified: userProfile.emailVerified ?? currentUser?.emailVerified ?? false,
                        createdAt: userProfile.createdAt || currentUser?.createdAt || null,
                        updatedAt: userProfile.updatedAt || currentUser?.updatedAt || null,
                        metadata: userProfile.metadata || currentUser?.metadata || null,
                        firstName: userProfile.firstName ?? currentUser?.firstName ?? null,
                        lastName: userProfile.lastName ?? currentUser?.lastName ?? null,
                        age: userProfile.age ?? currentUser?.age ?? null,
                    }});
                    set({ isRegisteredFireStore: true });
                }
            } catch (error: any) {
                console.error('Error en getProfile:', error);
                throw error;
            }
        },
        /**
         * Signs out the current user from Firebase
         * 
         * Clears the user state in the store after successful sign out.
         */
        logout: async () => {
            await signOut(auth).then(() => {
                set({ user: null })
            })
        },
        /**
         * Updates the current user's profile in the backend
         * 
         * Updates user profile information (firstName, lastName, age) in the backend.
         * Note: displayName parameter is declared but currently not used in implementation.
         * 
         * @param firstName - User's first name
         * @param lastName - User's last name
         * @param age - User's age
         */
        updateProfile: async (firstName: string, lastName: string, age: number) => {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                await api.updateProfile({ firstName, lastName, age }, user.uid, token);
                // Note: displayName parameter is not currently used but kept for API compatibility
            }
        }
    }))
    
    export default useAuthStore;