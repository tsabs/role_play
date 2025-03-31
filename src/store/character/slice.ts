import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { CHARACTER_MODULE_KEY } from '../constants';
import { db } from '../../../firebaseConfig';

export interface GenericCharacter {
    id: string;
    name: string;
    userEmail: string;
    description: string;
    background: string;
    // Cause DnD has background as talent this is actually the user imagined background
    race: string;
    className: string;
    gameType: string;
    gameId?: string;
    additionalBackground?: string;
}

interface CharactersState {
    characters: GenericCharacter[];
}

const initialState: CharactersState = {
    characters: [],
};

declare global {
    interface AppState {
        [CHARACTER_MODULE_KEY]?: CharactersState;
    }
}

// Helper function to persist to AsyncStorage
const saveToStorage = async (characters: GenericCharacter[]) => {
    try {
        await AsyncStorage.setItem(
            CHARACTER_MODULE_KEY,
            JSON.stringify(characters)
        );
    } catch (error) {
        console.error('Failed to save characters:', error);
    }
};

export const loadCharactersFromFirebase = async (
    clientEmail: string,
    dispatch: any
) => {
    const docRef = doc(db, 'characters', clientEmail);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists() && docSnapshot.data().length > 0) {
        await AsyncStorage.setItem(
            CHARACTER_MODULE_KEY,
            JSON.stringify(docSnapshot.data())
        );

        dispatch(
            characterSlice.actions.setCharacters(
                docSnapshot.data() as GenericCharacter[]
            )
        );
    } else {
        console.log('No such document!');
    }
};

// Async function to load from AsyncStorage
export const loadCharacters = async (clientEmail: string, dispatch: any) => {
    try {
        const data = await AsyncStorage.getItem(CHARACTER_MODULE_KEY);
        console.log(data);
        if (data) {
            dispatch(characterSlice.actions.setCharacters(JSON.parse(data)));
        } else {
            console.log('No local data, fetching from Firebase...');
            await loadCharactersFromFirebase(clientEmail, dispatch); // Fetch from Firebase only if local storage is empty
        }
    } catch (error) {
        console.error('Failed to load characters from AsyncStorage:', error);
    }
};

export const characterSlice = createSlice({
    name: CHARACTER_MODULE_KEY,
    initialState,
    reducers: {
        setCharacter: (state, action: PayloadAction<GenericCharacter>) => {
            state.characters.push(action.payload);
            saveToStorage(state.characters);

            setDoc(
                doc(
                    db,
                    'characters',
                    action.payload.userEmail,
                    'character',
                    action.payload.id
                ),
                action.payload
            )
                .then(() => console.log('Character added to Firebase'))
                .catch((error) =>
                    console.error('Error adding character:', error)
                );

            // firestore().collection('characters').add();
        },
        removeCharacter: (state, action: PayloadAction<{ name: string }>) => {
            state.characters = state.characters.filter(
                (character) => character.name !== action.payload.name
            );

            saveToStorage(state.characters);
        },
        setCharacters: (state, action: PayloadAction<GenericCharacter[]>) => {
            state.characters = action.payload;
            console.log('FROM set characters', state.characters);
        },
    },
});
