import { Context, createContext, useContext, useEffect, useState } from 'react';
import {
    FirebaseAuthTypes,
    onAuthStateChanged,
} from '@react-native-firebase/auth';

import { auth } from '../../../firebaseConfig';

export interface AuthProps {
    user?: FirebaseAuthTypes.User;
    token?: string;
    loading?: boolean;
}

export const AuthContext: Context<AuthProps> = createContext({});
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Refresh token and keep user logged in
                const t = await currentUser.getIdToken(true);
                setUser(currentUser);
                setToken(t);

                // Refresh token periodically
                const refreshTokenInterval = setInterval(
                    async () => {
                        try {
                            const newToken = await currentUser.getIdToken(true); // Force refresh token
                            setToken(newToken);
                        } catch (error) {
                            console.error('Token refresh error:', error);
                        }
                    },
                    30 * 60 * 1000
                ); // Refresh every 30 minutes
                return () => {
                    setIsLoading(false);
                    return clearInterval(refreshTokenInterval);
                }; // Cleanup on unmount
            } else {
                setUser(null);
                setToken(null);
            }
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading: isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
