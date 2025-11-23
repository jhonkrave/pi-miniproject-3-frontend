/**
 * API Client Module
 * 
 * Provides HTTP client functionality for communicating with the backend API.
 * Handles authentication, request/response normalization, error handling, and
 * user profile management operations.
 * 
 * Features:
 * - JWT token-based authentication
 * - Automatic URL building from environment variables
 * - Request timeout handling
 * - User data normalization
 * - Error message extraction from API responses
 * 
 * @module api
 */

/**
 * User type definition
 * 
 * Represents a user object with authentication and profile information.
 * Combines Firebase Authentication data with backend profile data.
 * 
 * @typedef {Object} User
 * @property {string | null} uid - Unique user identifier from Firebase
 * @property {string | null} email - User's email address
 * @property {string | null} [firstName] - User's first name
 * @property {string | null} [lastName] - User's last name
 * @property {string | null} [displayName] - User's display name
 * @property {number | null} [age] - User's age
 * @property {boolean} disabled - Whether the user account is disabled
 * @property {string | null} [photoURL] - URL to user's profile photo
 * @property {boolean} emailVerified - Whether the email is verified
 * @property {Date | null} createdAt - Account creation timestamp
 * @property {Date | null} updatedAt - Last update timestamp
 * @property {Object | null} [metadata] - Additional user metadata
 * @property {string} [metadata.creationTime] - Account creation time as string
 * @property {string} [metadata.lastSignInTime] - Last sign-in time as string
 */
export type User = {
    uid: string | null;
    email: string | null;
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    age?: number | null;
    disabled: boolean | false;
    photoURL?: string | null;
    emailVerified: boolean | false;
    createdAt: Date | null;
    updatedAt: Date | null;
    metadata?: {
      creationTime?: string;
      lastSignInTime?: string;
    } | null;
  };

  const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '/api';

  /**
   * Builds a complete URL from a path segment
   * 
   * Constructs a full API URL by combining the base URL (from environment
   * variables or default) with the provided path. Normalizes trailing slashes
   * and path formatting.
   * 
   * @param {string} path - API endpoint path (e.g., '/auth/user123' or 'auth/user123')
   * @returns {string} Complete URL string
   * 
   * @example
   * buildUrl('/auth/user123') // Returns: '/api/auth/user123' or 'http://localhost:3000/api/auth/user123'
   */
  function buildUrl(path: string): string {
    const base = (BASE_URL || '').replace(/\/$/, '');
    const p = path.startsWith('/') ? path : `/${path}`;
    if (!BASE_URL) {
      // Helpful hint during local dev if env is missing
      // eslint-disable-next-line no-console
      console.warn('[api] VITE_API_BASE_URL is not set. Using http://localhost:3000/api');
    }
    return `${base}${p}`;
  }

  /**
   * Normalizes raw API response data into a User object
   * 
   * Transforms backend API response data into a standardized User format.
   * Handles both wrapped responses (with `data` property) and direct user objects.
   * Ensures all User properties are properly typed and null-safe.
   * 
   * @param {any} raw - Raw response data from the API (may have `data` wrapper)
   * @returns {User} Normalized User object
   * 
   * @example
   * normalizeUser({ data: { uid: '123', email: 'user@example.com' } })
   * normalizeUser({ uid: '123', email: 'user@example.com' })
   */
  function normalizeUser(raw: any): User {
    const user = raw?.data || raw;

    return {
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        age: user?.age,
        disabled: user?.disabled,
        emailVerified: user?.emailVerified,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
        metadata: user?.metadata,
        firstName: user?.firstName,
        lastName: user?.lastName,
    } as User;
  }

  /**
   * Generic HTTP client function for making API requests
   * 
   * Performs HTTP requests to the backend API with automatic error handling,
   * timeout management, and request/response logging for password-related endpoints.
   * 
   * Features:
   * - Automatic timeout handling (60s for password endpoints, 15s for others)
   * - Request abort controller for timeout cancellation
   * - Detailed logging for password-related endpoints
   * - Error message extraction from API responses
   * - Support for 204 No Content responses
   * - CORS-friendly credentials handling
   * 
   * @template T - Expected return type
   * @param {string} path - API endpoint path
   * @param {RequestInit} [init] - Fetch API request options (method, headers, body, etc.)
   * @returns {Promise<T>} Promise resolving to the response data
   * @throws {Object} Error object with `status` and `message` properties
   * 
   * @example
   * await http<User>('/auth/user123', { 
   *   method: 'GET', 
   *   headers: { 'Authorization': 'Bearer token' } 
   * })
   */
  async function http<T>(path: string, init?: RequestInit): Promise<T> {
    const url = buildUrl(path);
    const method = (init?.method || 'GET').toString();
    const shouldDebug = (path.includes('/auth/password/forgot') || path.includes('/auth/password/reset') || path.includes('/auth/password/verify'));
    const startedAt = Date.now();
    if (shouldDebug) {
      // eslint-disable-next-line no-console
      console.log('[api:http] ->', method, url);
    }
    const controller = new AbortController();
    const timeoutMs = path.includes('/auth/password/') ? 60000 : 15000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    console.log('init', init);
    let res: Response;
    try {
      res = await fetch(url, {
        method: init?.method || 'GET',
        // Avoid sending cookies for public endpoints to reduce CORS/preflight issues
        // Password endpoints are public and don't require credentials
        credentials: path.includes('/auth/password/') ? 'omit' : 'include',
        signal: controller.signal,
        body: init?.body,
        headers: { 
          'Content-Type': 'application/json', 
          ...(init?.headers || {}) 
        },
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (shouldDebug) {
        // eslint-disable-next-line no-console
        console.error('[api:http] network error <-', err?.message || err);
      }
      // Handle network errors or timeouts
      throw { 
        status: 0, 
        message: err?.name === 'AbortError' ? 'Tiempo de espera agotado' : 'Error de red' 
      } as { status: number; message: string };
    }
    clearTimeout(timeoutId);
    if (shouldDebug) {
      // eslint-disable-next-line no-console
      console.log('[api:http] <-', res.status, res.statusText, `${Date.now() - startedAt}ms`);
    }
    // Check for error status codes (accepts 2xx including 202 Accepted)
    if (res.status < 200 || res.status >= 300) {
      // Try to extract error message from response body
      let message = 'Error inesperado';
      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch {
        /* ignore JSON parse errors - use default message */
      }
      throw { status: res.status, message } as { status: number; message: string };
    }
    
    // Handle 204 No Content responses
    if (res.status === 204) return undefined as unknown as T;
    try {
      const json = (await res.json()) as T;
      if (shouldDebug) {
        // eslint-disable-next-line no-console
        console.log('[api:http] body <-', json);
      }
      return json;
    } catch {
      // No JSON body (e.g., 204), just return undefined
      return undefined as unknown as T;
    }
  }

  /**
   * API Client Object
   * 
   * Provides methods for interacting with the backend authentication and user profile API.
   * All methods handle JWT token authentication and normalize responses to User objects.
   * 
   * @namespace api
   */
  export const api = {
    
    /**
     * Retrieves user profile from the backend
     * 
     * Fetches a user's complete profile information from the backend API
     * using their unique identifier and authentication token.
     * 
     * @param {string} uid - User's unique identifier
     * @param {string} token - JWT authentication token
     * @returns {Promise<User>} Promise resolving to the user profile
     * @throws {Object} Error object if request fails
     * 
     * @example
     * const user = await api.getProfile('user123', 'jwt_token_here')
     */
    getProfile(uid: string, token: string) {
        return http<User>(`/auth/${uid}`, { 
          method: 'GET', 
          headers: { 'Authorization': `Bearer ${token}` } 
        }).then(normalizeUser);
    },

    /**
     * Creates a new user profile in the backend
     * 
     * Completes user registration by creating a profile in the backend
     * with additional user information. Should be called after Firebase
     * authentication is established.
     * 
     * @param {Object} payload - User registration data
     * @param {string} payload.firstName - User's first name
     * @param {string} payload.lastName - User's last name
     * @param {number} payload.age - User's age
     * @param {string} payload.email - User's email address
     * @param {string} payload.password - User's password (will be sent to backend)
     * @param {string} token - JWT authentication token from Firebase
     * @returns {Promise<User>} Promise resolving to the created user profile
     * @throws {Object} Error object if request fails
     * 
     * @example
     * const user = await api.signup({
     *   firstName: 'John',
     *   lastName: 'Doe',
     *   age: 30,
     *   email: 'john@example.com',
     *   password: 'securePassword'
     * }, 'jwt_token_here')
     */
    signup(payload: { firstName: string; lastName: string; age: number; email: string; password: string }, token: string) {
      const body = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        age: payload.age,
        email: payload.email,
        password: payload.password,
      };
      console.log('body api signup', body);
      return http<User>(`/auth/signup`, { 
        method: 'POST', 
        body: JSON.stringify(body), 
        headers: { 'Authorization': `Bearer ${token}` } 
      }).then(normalizeUser);
    },

    /**
     * Updates user profile information in the backend
     * 
     * Updates a user's profile information in the backend. Note that
     * the backend expects `firstname` and `lastname` (lowercase) keys,
     * so the payload is transformed accordingly.
     * 
     * @param {Object} payload - Profile update data
     * @param {string} payload.firstName - User's first name
     * @param {string} payload.lastName - User's last name
     * @param {number} payload.age - User's age
     * @param {string} uid - User's unique identifier
     * @param {string} token - JWT authentication token
     * @returns {Promise<User>} Promise resolving to the updated user profile
     * @throws {Object} Error object if request fails
     * 
     * @example
     * const user = await api.updateProfile({
     *   firstName: 'Jane',
     *   lastName: 'Smith',
     *   age: 25
     * }, 'user123', 'jwt_token_here')
     */
    updateProfile(payload: { firstName: string; lastName: string; age: number }, uid: string, token: string) {
      // Backend expects lowercase keys (firstname, lastname)
      const body: any = {
        firstname: payload.firstName,
        lastname: payload.lastName,
        age: payload.age
      };
      
      return http<User>(`/auth/${uid}`, { 
        method: 'PUT', 
        body: JSON.stringify(body), 
        headers: { 'Authorization': `Bearer ${token}` } 
      }).then(normalizeUser);
    },

  };
  