// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyA5YGj_Gizk4xguuEyT8MUplj1bL8_n6rs',
    authDomain: 'role-play-ea5f2.firebaseapp.com',
    projectId: 'role-play-ea5f2',
    storageBucket: 'role-play-ea5f2.appspot.com',
    messagingSenderId: '110649929929',
    appId: '1:110649929929:web:149c4d697ccc68fab0dd18',
    measurementId: 'G-R2LPX6GXTP',
}

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig)
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIRESTORE_DB = getFirestore(FIREBASE_APP)
const analytics = getAnalytics(FIREBASE_APP)
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
