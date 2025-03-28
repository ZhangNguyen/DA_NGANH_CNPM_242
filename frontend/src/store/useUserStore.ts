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
    signIn: (data: any) => Promise<void>;
    signOut: () => void;
}

export const useUserStore = create<State & Actions>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: '',
            refreshToken: '',
            isAuthenticating: false,

            // Improved user setting method with error handling
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

            // Improved sign-in method with error handling
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
                } catch (error) {
                    console.error('Sign in failed:', error);
                    set({ 
                        isAuthenticating: false,
                        accessToken: '',
                        refreshToken: ''
                    });
                }
            },

            // Simple sign out method
            signOut: () => set({ 
                user: null, 
                accessToken: '', 
                refreshToken: '', 
                isAuthenticating: false 
            }),
        }),
        {
            name: 'user-store',
            // Optional: You can add partialize to control what gets stored
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                user: state.user,
                isAuthenticating: state.isAuthenticating
            })
        }
    )
);