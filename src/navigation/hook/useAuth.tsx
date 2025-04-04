import { Context, createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../../firebaseConfig';
import firebase from 'firebase/compat';
import User = firebase.User;

export interface AuthProps {
    user?: User;
    token?: string;
    loading?: boolean;
}

export const AuthContext: Context<AuthProps> = createContext({});
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                // Refresh token and keep user logged in
                const token = await currentUser.getIdToken(true);
                setUser(currentUser);
                setToken(token);

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
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading: isLoading, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthProps => {
    return useContext(AuthContext);
};
