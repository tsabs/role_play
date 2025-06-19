import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { doc, getDoc, setDoc } from '@react-native-firebase/firestore';

import { auth, db } from '../../../firebaseConfig';

import { LoginUserType, SignUpUserType } from './types';

export const signUpUser = async ({ email, password }: SignUpUserType) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

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

export const getUserInfo = async () => {
    const user = getAuth().currentUser;
    if (!user || !user?.email) throw new Error('User not authenticated');
    const userDocRef = doc(db, 'users', user.email);
    const snapshot = await getDoc(userDocRef);

    return snapshot.data();
};
