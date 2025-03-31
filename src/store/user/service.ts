import { auth, db } from '../../../firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { LoginUserType, SignUpUserType } from './types';

export const signUpUser = async ({ email, password }: SignUpUserType) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Save user role in Firestore
        await setDoc(doc(db, 'users', user.email), {
            email,
            uid: user.uid,
        })
            .then(() => console.log('User has been created'))
            .catch((err) => console.log('Error during user creation', err));

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
