import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStore {
    accessToken: string | null;
    isLoggedIn: boolean;
    signIn: (email: string, password: string) => void;
    signOut: () => void;
    setAccessToken: (accessToken: string) => void;    
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            accessToken: null,
            isLoggedIn: false,
            signIn: (email, password) => {
                // call api
                // setAccessToken(response.data.accessToken)
            },
            signOut: () => {
                // call api
                // setAccessToken(null)
            },
            setAccessToken: (accessToken) => set({ accessToken })
        }),
        {
            name: 'user-store',
        }
    )
)

