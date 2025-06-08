import { Dispatch } from 'react';
import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from '@react-native-firebase/firestore';

import { CHARACTER_MODULE_KEY } from '../constants';
import { db } from '../../../firebaseConfig';
import { Note } from '../../types/note';
import { Character, GAME_TYPE } from '../../types/generic';

interface CharactersState {
    characters: Character[];
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
    const characters: Character[] = docSnapshot.docs.map((d) => ({
        ...(d.data() as any),
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

export const loadClassData = async (gameType: GAME_TYPE, gameClass) => {
    const docRef = doc(db, 'games', gameType, 'classes', gameClass);
    const docSnapshot = await getDoc(docRef);

    return docSnapshot.data();
};

export const loadSpecificTalentClassPerLevel = async (
    gameType: GAME_TYPE,
    gameClass: string,
    level: string
) => {
    const docRef = collection(
        db,
        'games',
        gameType,
        'classes',
        gameClass,
        'levels'
    );
    const docSnapshot = await getDocs(docRef);

    return docSnapshot.docs
        .find((item) => item.data().level.toString() === level)
        .data();
};

// Async function to load from AsyncStorage
export const loadCharacters = async (userEmail: string, dispatch: any) => {
    try {
        const storedCharacters = await AsyncStorage.getItem(
            `characters_${userEmail}`
        );

        // if (storedCharacters) {
        //     console.log('Using cached characters');
        //     dispatch(
        //         characterSlice.actions.setCharacters(
        //             JSON.parse(storedCharacters)
        //         )
        //     );
        //     return JSON.parse(storedCharacters); // Use cached data
        // }

        await loadCharactersFromFirebase(userEmail, dispatch); // Fetch from Firebase only if local storage is empty
    } catch (error) {
        console.error('Failed to load characters from AsyncStorage:', error);
    }
};

export const callAddCharacter = async (
    character: Character,
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
            const currentCharacters: Character[] = storedCharacters
                ? JSON.parse(storedCharacters)
                : [];

            const updatedCharacters = [...currentCharacters, character];

            await AsyncStorage.setItem(
                `characters_${character.userEmail}`,
                JSON.stringify(updatedCharacters)
            );

            dispatch(characterSlice.actions.setCharacter(character));
            Toast.show({
                type: 'success',
                text1: 'Character added successfully!',
            });

            console.log('Character added successfully:', character);
        })
        .catch((error) => console.error('Error adding character:', error));
};

export const callUpdateCharacter = async (
    character: Character,
    dispatch: Dispatch<AnyAction>
) => {
    await setDoc(
        doc(db, 'characters', character.userEmail, 'character', character.id),
        character,
        { merge: true }
    )
        .then(async () => {
            const storedCharacters = await AsyncStorage.getItem(
                `characters_${character.userEmail}`
            );

            const parsedCharacters: Character[] = storedCharacters
                ? JSON.parse(storedCharacters)
                : [];

            const updatedCharacters = parsedCharacters.map(
                (storedChar: Character) =>
                    storedChar.id === character.id ? character : storedChar
            );

            await AsyncStorage.setItem(
                `characters_${character.userEmail}`,
                JSON.stringify(updatedCharacters)
            );

            dispatch(characterSlice.actions.updateCharacter(character));
            Toast.show({
                type: 'success',
                text1: 'Character added successfully!',
            });

            console.log('updatedCharacter : ', character);
        })
        .catch((error) => console.error('Error updating character:', error));
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
        let currentCharacters: Character[] = storedCharacters
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

export const callAddNote = async (
    userEmail: string,
    characterId: string,
    note: Note,
    dispatch: Dispatch<any>
) => {
    const storedCharacters = await AsyncStorage.getItem(
        `characters_${userEmail}`
    );
    let currentCharacters: Character[] = storedCharacters
        ? JSON.parse(storedCharacters)
        : [];

    const characterIndex = currentCharacters.findIndex(
        (char) => char.id === characterId
    );

    if (characterIndex !== -1) {
        const character = currentCharacters[characterIndex];

        if (!character.notes) {
            character.notes = [];
        }

        character.notes.unshift(note);

        console.log('character', character);
        console.log('currentCharacters', currentCharacters);

        const noteRef = doc(
            db,
            'characters',
            userEmail,
            'character',
            characterId
        );

        await updateDoc(noteRef, { notes: character.notes })
            .then(async () => {
                // Save to local storage
                await AsyncStorage.setItem(
                    `characters_${userEmail}`,
                    JSON.stringify(currentCharacters)
                );

                dispatch(characterSlice.actions.setNote({ characterId, note }));
                Toast.show({
                    type: 'success',
                    text1: 'Note saved successfully!',
                });

                console.log(
                    'Note added successfully to character:',
                    character.name
                );
            })
            .catch((err) => console.log(err));
    }
};

export const characterSlice = createSlice({
    name: CHARACTER_MODULE_KEY,
    initialState,
    reducers: {
        setCharacter: (state, action: PayloadAction<Character>) => {
            state.characters.push(action.payload);
        },
        updateCharacter: (state, action: PayloadAction<Character>) => {
            const index = state.characters.findIndex(
                (char) => char.id === action.payload.id
            );
            if (index !== -1) {
                state.characters[index] = action.payload;
            }
        },
        removeCharacter: (state, action: PayloadAction<{ id: string }>) => {
            state.characters = state.characters.filter(
                (character) => character.id !== action.payload.id
            );
        },
        setCharacters: (state, action: PayloadAction<Character[]>) => {
            state.characters = action.payload;
        },
        setNote: (
            state,
            action: PayloadAction<{ characterId: string; note: Note }>
        ) => {
            const characterIndex = state.characters.findIndex(
                (char) => char.id === action.payload.characterId
            );

            if (characterIndex !== -1) {
                const character = state.characters[characterIndex];

                if (!character.notes) {
                    character.notes = [];
                }

                character.notes.unshift(action.payload.note); // add newest note at top
            }
        },
    },
});
