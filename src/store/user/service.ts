import { auth, db } from '../../../firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { LoginUserType, SignUpUserType } from './types';

export const signUpUser = async ({ email, password, role }: SignUpUserType) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Save user role in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email,
            role, // "player" or "game_master"
        });

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const loginUser = async ({ email, password }: LoginUserType) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential.user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
