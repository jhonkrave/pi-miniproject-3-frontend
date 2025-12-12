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
  status: 'scheduled' | 'active' | 'ended' | 'cancelled';
  maxParticipants: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MeetingPayload {
  title: string;
  description?: string;
  startDateTime: string;
  maxParticipants?: number;
}

export interface TranscriptionSegment {
    timestamp: string;
    speaker: string;
    text: string;
}

// Helper types for backend responses
interface WrapperResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
  error?: string;
}

type BackendResponse<T> = T | WrapperResponse<T>;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
}

function normalizeUser(backendUser: User | WrapperResponse<User>): User {
    if (!backendUser) throw new Error("User data is required");
    
    // Check if it's a wrapper response
    const userData = (backendUser as WrapperResponse<User>).data || (backendUser as User);
    
    if (!userData) throw new Error("User data format is invalid");

    // Ensure we return a valid User object even if backend sends partial data
    return {
        uid: userData.uid || 'unknown',
        email: userData.email || '',
        displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        photoURL: userData.photoURL,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        createdAt: userData.createdAt,
        metadata: userData.metadata
    };
}

/**
 * Generic HTTP client function for making API requests
 */
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const method = (init?.method || 'GET').toString();
  const shouldDebug = true;
  const startedAt = Date.now();

  if (shouldDebug) {
    console.log('[api:http] ->', method, url);
  }
  
  const controller = new AbortController();
  // Increase timeout for transcription uploads (audio files can be large)
  const isUpload = path.includes('/transcription') && method === 'POST';
  const timeoutMs = (path.includes('/auth/password/') || isUpload) ? 120000 : 15000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  // Prepare headers
  const headers: HeadersInit = {
    ...(init?.headers || {})
  };
  
  // Only add Content-Type if it's not a GET/HEAD request
  if (method !== 'GET' && method !== 'HEAD') {
    // Cast to Record to check property existence safely
    const headerRecord = headers as Record<string, string>;
    if (!headerRecord['Content-Type'] && !(init?.body instanceof FormData)) {
        headerRecord['Content-Type'] = 'application/json';
    }
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: init?.method || 'GET',
      credentials: path.includes('/auth/password/') ? 'omit' : 'include',
      signal: controller.signal,
      body: init?.body,
      headers: headers,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (shouldDebug) {
      console.error('[api:http] network error <-', (err as Error)?.message || err);
    }
    const errorObj = err as { name?: string };
    throw {
      status: 0,
      message: errorObj?.name === 'AbortError' ? 'Tiempo de espera agotado' : 'Error de red'
    };
  }
  
  clearTimeout(timeoutId);
  
  if (shouldDebug) {
    console.log('[api:http] <-', res.status, res.statusText, `${Date.now() - startedAt}ms`);
  }

  if (res.status < 200 || res.status >= 300) {
    let message = 'Error inesperado';
    try {
      const textBody = await res.text();
      try {
        const data = JSON.parse(textBody);
        console.error('[api:http] error body:', data);
        if (data?.message) message = data.message;
        if (data?.error) message += ` (${data.error})`;
      } catch {
        console.error('[api:http] error text:', textBody);
        if (textBody.includes('Cannot')) message = 'Ruta no encontrada en el servidor (404)';
      }
    } catch (e) {
      console.error('[api:http] Failed to read error body', e);
    }
    throw { status: res.status, message };
  }

  if (res.status === 204) return undefined as unknown as T;
  
  try {
    const json = (await res.json()) as T;
    if (shouldDebug) {
      console.log('[api:http] body <-', json);
    }
    return json;
  } catch {
    return undefined as unknown as T;
  }
}

// Helper to extract data from potential wrapper
function extractData<T>(res: BackendResponse<T>): T {
    if (res && typeof res === 'object' && 'data' in res) {
        return (res as WrapperResponse<T>).data as T;
    }
    return res as T;
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

  signup: (userData: Partial<User>, token?: string) =>
    http<{ status: string, user: User }>('/auth/signup', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(userData)
    }),

  // Users
  getProfile: async (uid: string, token: string) => {
    try {
        const userResponse = await http<BackendResponse<User>>(`/auth/${uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return normalizeUser(userResponse);
    } catch (error: unknown) {
        const err = error as { status?: number };
        if (err.status === 404) {
            throw error; 
        }
        throw error;
    }
  },

  updateProfile: async (uid: string, data: Partial<User>, token: string) => {
    const userResponse = await http<BackendResponse<User>>(`/auth/${uid}`, {
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
    const res = await http<BackendResponse<Meeting[]>>('/meetings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const data = extractData(res);
    if (Array.isArray(data)) {
        return data;
    }
    return [];
  },

  createMeeting: async (data: MeetingPayload, token: string): Promise<Meeting> => {
    const res = await http<BackendResponse<Meeting>>('/meetings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return extractData(res);
  },

  getMeetingById: async (id: string, token: string): Promise<Meeting> => {
    const res = await http<BackendResponse<Meeting>>(`/meetings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return extractData(res);
  },

  getMeetingTranscription: async (id: string, token: string): Promise<TranscriptionSegment[] | string> => {
      const res = await http<BackendResponse<TranscriptionSegment[] | string>>(`/meetings/${id}/transcription`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      return extractData(res);
  },

  uploadMeetingRecording: async (id: string, audioBlob: Blob, token: string): Promise<void> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    
    await http<void>(`/meetings/${id}/transcription`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
  },

  updateMeeting: async (id: string, data: Partial<Meeting>, token: string): Promise<Meeting> => {
    const res = await http<BackendResponse<Meeting>>(`/meetings/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
    });
    return extractData(res);
  },
};
