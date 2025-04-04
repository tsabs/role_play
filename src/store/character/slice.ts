import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    collection,
    doc,
    deleteDoc,
    getDocs,
    setDoc,
} from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { CHARACTER_MODULE_KEY } from '../constants';
import { db } from '../../../firebaseConfig';
import { Dispatch } from 'react';

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
    characterImg?: string;
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

export const loadCharactersFromFirebase = async (
    clientEmail: string,
    dispatch: Dispatch<any>
) => {
    const docRef = collection(db, 'characters', clientEmail, 'character');
    const docSnapshot = await getDocs(docRef);

    // Extract data from each document
    const characters: GenericCharacter[] = docSnapshot.docs.map((doc) => ({
        ...(doc.data() as any),
    }));

    if (characters && characters.length > 0) {
        // Save to AsyncStorage
        await AsyncStorage.setItem(
            `characters_${clientEmail}`,
            JSON.stringify(characters)
        );
        dispatch(characterSlice.actions.setCharacters(characters));
        console.log('Fetched and saved characters:', characters);
    } else {
        console.log('No such document!');
    }
};

// Async function to load from AsyncStorage
export const loadCharacters = async (userEmail: string, dispatch: any) => {
    try {
        const storedCharacters = await AsyncStorage.getItem(
            `characters_${userEmail}`
        );

        console.log(JSON.parse(storedCharacters));

        if (storedCharacters) {
            console.log('Using cached characters');
            dispatch(
                characterSlice.actions.setCharacters(
                    JSON.parse(storedCharacters)
                )
            );
            return JSON.parse(storedCharacters); // Use cached data
        }

        await loadCharactersFromFirebase(userEmail, dispatch); // Fetch from Firebase only if local storage is empty
    } catch (error) {
        console.error('Failed to load characters from AsyncStorage:', error);
    }
};

export const callAddCharacter = async (
    character: GenericCharacter,
    dispatch: Dispatch<AnyAction>
) => {
    await setDoc(
        doc(db, 'characters', character.userEmail, 'character', character.id),
        character
    )
        .then(async () => {
            const storedCharacters = await AsyncStorage.getItem(
                `characters_${character.userEmail}`
            );
            const currentCharacters: GenericCharacter[] = storedCharacters
                ? JSON.parse(storedCharacters)
                : [];

            const updatedCharacters = [...currentCharacters, character];

            await AsyncStorage.setItem(
                `characters_${character.userEmail}`,
                JSON.stringify(updatedCharacters)
            );

            dispatch(characterSlice.actions.setCharacter(character));
            console.log('Character added successfully:', character);
        })
        .catch((error) => console.error('Error adding character:', error));
};

export const callRemoveCharacter = async (
    userEmail: string,
    characterId: string,
    dispatch: Dispatch<any>
) => {
    await deleteDoc(
        doc(db, 'characters', userEmail, 'character', characterId)
    ).then(async () => {
        const storedCharacters = await AsyncStorage.getItem(
            `characters_${userEmail}`
        );
        let currentCharacters: GenericCharacter[] = storedCharacters
            ? JSON.parse(storedCharacters)
            : [];
        currentCharacters = currentCharacters.filter(
            (char) => char.id !== characterId
        );
        await AsyncStorage.setItem(
            `characters_${userEmail}`,
            JSON.stringify(currentCharacters)
        );
        dispatch(characterSlice.actions.removeCharacter({ id: characterId }));
        console.log('Character deleted from Firebase');
    });
};

export const characterSlice = createSlice({
    name: CHARACTER_MODULE_KEY,
    initialState,
    reducers: {
        setCharacter: (state, action: PayloadAction<GenericCharacter>) => {
            state.characters.push(action.payload);
        },
        removeCharacter: (state, action: PayloadAction<{ id: string }>) => {
            state.characters = state.characters.filter(
                (character) => character.id !== action.payload.id
            );
        },
        setCharacters: (state, action: PayloadAction<GenericCharacter[]>) => {
            state.characters = action.payload;
        },
    },
});
