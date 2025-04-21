import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiSignIn, apiGetUser } from '@/apis/auth'

// Improved type definitions
interface User {
    id?: string;
    username?: string;
}

interface State {
    user: User | null;
    accessToken: string;
    refreshToken: string;
    isAuthenticating: boolean;
}
interface Actions {
    setUser: () => Promise<void>;
    signIn: (data: any) => Promise<boolean>;
    signOut: () => void;
}

export const useUserStore = create<State & Actions>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: '',
            refreshToken: '',
            isAuthenticating: false,

            setUser: async () => {
                try {
                    const response = await apiGetUser();
                    
                    if (response) {
                        set({ 
                            user: {
                                username: response.data.userName, 
                                id: response.data.id
                            } 
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    
                    set({ user: null });
                }
            },

            signIn: async (data) => {
                try {
                    const response = await apiSignIn(data);
                    
                    if (response?.data) {
                        set({ 
                            isAuthenticating: true,
                            accessToken: response.data.access_token,
                            refreshToken: response.data.refresh_token
                        });
                    }
                    return true;
                } catch (error) {
                    console.error('Sign in failed:', error);
                    set({ 
                        isAuthenticating: false,
                        accessToken: '',
                        refreshToken: ''
                    });
                    return false;
                }
            },

            signOut: () => set({ 
                user: null, 
                accessToken: '', 
                refreshToken: '', 
                isAuthenticating: false 
            }),
        }),
        {
            name: 'user-store',
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                user: state.user,
                isAuthenticating: state.isAuthenticating
            })
        }
    )
);