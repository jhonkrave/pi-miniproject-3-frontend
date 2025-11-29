/**
 * Authentication Store using Zustand
 * 
 * Manages the global authentication state.
 * Logic is delegated to authService.ts.
 */

import { create } from 'zustand';
import { type User } from '../lib/api';

type AuthStore = {
    user: User | null;
    isInitialized: boolean;
    isLoading: boolean;
    
    setUser: (user: User | null) => void;
    setIsInitialized: (isInitialized: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isInitialized: false,
    isLoading: true,

    setUser: (user) => set({ user }),
    setIsInitialized: (isInitialized) => set({ isInitialized }),
    setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
