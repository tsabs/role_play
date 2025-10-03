import { Context, createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    FirebaseAuthTypes,
    onAuthStateChanged,
} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const initializeAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Failed to restore user session:', error);
            }
            // setIsLoading(false);
        };

        initializeAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const t = await currentUser.getIdToken(true); // Get a fresh token
                    setUser(currentUser);
                    setToken(t);
                    await AsyncStorage.setItem('token', t);
                } catch (error) {
                    console.error('Token refresh error:', error);
                    Alert.alert('Error retrieving token', error.message);
                }
            } else {
                setUser(null);
                setToken(null);
                await AsyncStorage.removeItem('token');
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
