import { getApp } from '@react-native-firebase/app';
import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

const db = getFirestore();

const auth: FirebaseAuthTypes.Module = getAuth(getApp());
// console.log('auth', auth);
export { auth, db };
