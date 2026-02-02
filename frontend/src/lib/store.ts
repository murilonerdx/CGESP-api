import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    region: string | null;
    avatarUrl?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    updateRegion: (region: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
            updateRegion: (region) => set((state) => ({
                user: state.user ? { ...state.user, region } : null,
            })),
        }),
        {
            name: 'cge-auth-storage',
        }
    )
);
