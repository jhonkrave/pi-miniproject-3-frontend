export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  createdAt?: string;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  createdBy: string;
  participants?: string[];
}

export interface MeetingPayload {
  title: string;
  description?: string;
  startDateTime: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
}

function normalizeUser(backendUser: any): User {
    if (!backendUser) throw new Error("User data is required");
    // Handle backend response wrapper { success: true, data: { ... } }
    const userData = backendUser.data || backendUser;
    
    return {
        uid: userData.uid || userData.id,
        email: userData.email,
        displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        photoURL: userData.photoURL,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        createdAt: userData.createdAt
    };
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
 */
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const method = (init?.method || 'GET').toString();
  const shouldDebug = true; // Force debug to see errors
  const startedAt = Date.now();
  if (shouldDebug) {
    // eslint-disable-next-line no-console
    console.log('[api:http] ->', method, url);
  }
  const controller = new AbortController();
  const timeoutMs = path.includes('/auth/password/') ? 60000 : 15000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  // Prepare headers
  const headers: HeadersInit = {
    ...(init?.headers || {})
  };
  
  // Only add Content-Type if it's not a GET/HEAD request and body exists or needed
  if (method !== 'GET' && method !== 'HEAD') {
    // If Content-Type is not already set by caller (like for FormData which sets it automatically with boundary)
    if (!(headers as any)['Content-Type']) {
        (headers as any)['Content-Type'] = 'application/json';
    }
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: init?.method || 'GET',
      // Avoid sending cookies for public endpoints to reduce CORS/preflight issues
      // Password endpoints are public and don't require credentials
      credentials: path.includes('/auth/password/') ? 'omit' : 'include',
      signal: controller.signal,
      body: init?.body,
      headers: headers,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (shouldDebug) {
      // eslint-disable-next-line no-console
      console.error('[api:http] network error <-', (err as any)?.message || err);
    }
    // Handle network errors or timeouts
    throw {
      status: 0,
      message: (err as any)?.name === 'AbortError' ? 'Tiempo de espera agotado' : 'Error de red'
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
      // Read text once to avoid "stream already read" error
      const textBody = await res.text();
      try {
        const data = JSON.parse(textBody);
        console.error('[api:http] error body:', data);
        if (data?.message) message = data.message;
        if (data?.error) message += ` (${data.error})`;
      } catch {
        // No es JSON válido
        console.error('[api:http] error text:', textBody);
        // HTML error pages from Express often contain <pre>Cannot PUT ...</pre>
        if (textBody.includes('Cannot')) message = 'Ruta no encontrada en el servidor (404)';
      }
    } catch (e) {
      console.error('[api:http] Failed to read error body', e);
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

export const api = {
  // Auth & Session
  createSession: (idToken: string) => 
    http<{ status: string }>('/auth/session', {
      method: 'POST',
      body: JSON.stringify({ idToken })
    }),

  logout: () => 
    http<{ status: string }>('/auth/logout', {
      method: 'POST'
    }),

  signup: (userData: any, token?: string) =>
    http<{ status: string, user: User }>('/auth/signup', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(userData)
    }),

  // Users
  getProfile: async (uid: string, token: string) => {
    try {
        // Intento con /auth/ primero, si falla probamos /users/ por compatibilidad
        // Pero según logs, el router base es /auth
        const userResponse = await http<any>(`/auth/${uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return normalizeUser(userResponse);
    } catch (error) {
        if ((error as any).status === 404) {
            throw error; 
        }
        throw error;
    }
  },

  updateProfile: async (uid: string, data: Partial<User>, token: string) => {
    const userResponse = await http<any>(`/auth/${uid}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return normalizeUser(userResponse);
  },

  deleteAccount: (uid: string, token: string) => 
    http<{ status: string }>(`/auth/${uid}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),

  // Meetings
  getMeetings: async (token: string): Promise<Meeting[]> => {
    const res = await http<any>('/meetings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Handle backend response wrapper { success: true, data: [...] }
    if (res && res.data && Array.isArray(res.data)) {
        return res.data;
    }
    // Handle direct array response (fallback)
    if (Array.isArray(res)) {
        return res;
    }
    return [];
  },

  createMeeting: async (data: MeetingPayload, token: string): Promise<Meeting> => {
    const res = await http<any>('/meetings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    // Handle backend response wrapper { success: true, data: { ... } }
    if (res && res.data) {
        return res.data;
    }
    return res;
  },
};
