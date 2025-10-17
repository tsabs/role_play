import { Dispatch } from 'react';
import {
    Action,
    createAsyncThunk,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { getAuth } from '@react-native-firebase/auth';
import {
    collection,
    collectionGroup,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
    writeBatch,
} from '@react-native-firebase/firestore';
import { Note } from 'types/note';
import { Character, GAME_TYPE } from 'types/generic';
import { Spell } from 'types/games/d2d5e';

import { capitalizeFirstLetter } from '@utils/utils';

import { CHARACTER_MODULE_KEY } from '../constants';
import { db } from '../../../firebaseConfig';
import { addNote, removeNote } from '../../firestore/firestoreNotes';

interface CharactersState {
    characters: Character[];
    error: any;
}

const initialState: CharactersState = {
    characters: [],
    error: undefined,
};

declare global {
    interface AppState {
        [CHARACTER_MODULE_KEY]?: CharactersState;
    }
}

export const loadCharactersFromFirebase = async (dispatch: Dispatch<any>) => {
    const docRef = collection(db, 'characters');
    const docSnapshot = await getDocs(docRef);

    // Extract data from each document
    const characters: Character[] = docSnapshot.docs.map((d) => ({
        ...(d.data() as Character),
    }));

    if (characters && characters.length > 0) {
        // Save to AsyncStorage
        await AsyncStorage.setItem(`characters`, JSON.stringify(characters));
        dispatch(characterSlice.actions.setCharacters(characters));
        // console.log('Fetched and saved characters:', characters);
    } else {
        console.log('No such document!');
    }
};

export const loadClassData = async (gameType: GAME_TYPE, gameClass) => {
    const docRef = doc(db, 'games', gameType, 'classes', gameClass);
    const docSnapshot = await getDoc(docRef);

    return docSnapshot.data();
};

/**
 * Fetch spells from the Firestore database based on class and level.
 *
 * @param characterClass - The class to filter spells on (e.g., "Wizard").
 * @param operator - Optional operator filter (e.g, ==, <=, etc.)
 * @param level - Optional level filter (e.g., 1, 2, etc.).
 * @param subClass - Optional subclass filter (e.g., "Lore").
 * @returns Promise<Spell[]> - Array of spells matching the filters.
 */
export const fetchSpells = async (
    characterClass: string,
    operator: '==' | '<=' = '==',
    level?: number,
    subClass?: string
): Promise<Spell[]> => {
    try {
        const spellsRef = collection(db, 'games', 'dnd5e', 'spells');
        const queries = [];
        // Build Firestore-compatible objects for filtering
        const buildEntry = (index: string, name: string) => ({
            index,
            name: capitalizeFirstLetter(index),
            url: `/api/2014/${name}/${index}`,
        });
        const classObj = characterClass
            ? buildEntry(characterClass, 'classes')
            : undefined;
        const subClassObj = subClass
            ? buildEntry(subClass, 'subclasses')
            : undefined;
        // --- Build queries dynamically ---
        if (classObj && level !== undefined) {
            queries.push(
                query(
                    spellsRef,
                    where('classes', 'array-contains', classObj),
                    where('level', operator, level)
                )
            );
        } else if (classObj) {
            queries.push(
                query(spellsRef, where('classes', 'array-contains', classObj))
            );
        }
        if (subClassObj && level !== undefined) {
            queries.push(
                query(
                    spellsRef,
                    where('subclasses', 'array-contains', subClassObj),
                    where('level', operator, level)
                )
            );
        } else if (subClassObj) {
            queries.push(
                query(
                    spellsRef,
                    where('subclasses', 'array-contains', subClassObj)
                )
            );
        }
        if (!classObj && !subClassObj && level !== undefined) {
            queries.push(query(spellsRef, where('level', '==', level)));
        }

        if (queries.length === 0) {
            // no filters applied → fetch all spells
            queries.push(spellsRef);
        }
        // --- Execute queries in parallel ---
        const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
        // --- Merge & deduplicate ---
        const spellsMap = new Map<string, Spell>();
        for (const snap of snapshots) {
            snap.docs.forEach((d) => {
                spellsMap.set(d.id, d.data() as Spell);
            });
        }
        return Array.from(spellsMap.values());
    } catch (error) {
        console.error('Error fetching spells: ', error);
        throw error;
    }
};

const bardLoreExclusiveSpells = [
    'arcane-eye',
    'aura-of-vitality',
    'aura-of-purity',
    'banishment',
    'conjure-fey',
    'etherealness',
    'planar-ally',
    'magic-circle',
    'counterspell',
    'dispel-magic',
    'fireball',
    'lightning-bolt',
    'mass-cure-wounds',
    'raise-dead',
    'bestow-curse',
    'fear',
    'glyph-of-warding',
    'dimension-door',
    'legend-lore',
    'teleport',
];

export const cleanLoreSubclasses = async () => {
    const spellsRef = collection(db, 'games', 'dnd5e', 'spells');
    const snap = await getDocs(spellsRef);

    const updates = snap.docs.map(async (spellDoc) => {
        const data = spellDoc.data();
        const subclasses = data.subclasses || [];
        const index = data.index; // Assuming each spell has an index like "planar-ally"

        // Keep lore only if this spell is in the Lore Bard list
        const filteredSubclasses = subclasses.filter((sc: any) => {
            if (sc.index !== 'lore') return true;
            return bardLoreExclusiveSpells.includes(index);
        });

        // Only update if something actually changed
        if (filteredSubclasses.length !== subclasses.length) {
            await updateDoc(doc(db, 'games', 'dnd5e', 'spells', spellDoc.id), {
                subclasses: filteredSubclasses,
            });
            console.log(`Updated ${index}: removed lore subclass`);
        }
    });

    await Promise.all(updates);
    console.log('✅ Finished cleaning lore subclasses');
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
export const loadCharacters = async (dispatch: any) => {
    try {
        // const storedCharacters = await AsyncStorage.getItem(`characters`);

        // if (storedCharacters) {
        //     console.log('Using cached characters');
        //     dispatch(
        //         characterSlice.actions.setCharacters(
        //             JSON.parse(storedCharacters)
        //         )
        //     );
        //     return JSON.parse(storedCharacters); // Use cached data
        // }
        await loadCharactersFromFirebase(dispatch); // Fetch from Firebase only if local storage is empty
    } catch (error) {
        console.error('Failed to load characters from AsyncStorage:', error);
    }
};

export const migrateCharacters = async () => {
    try {
        const charsSnap = await getDocs(collectionGroup(db, 'character'));
        console.log('found characters:', charsSnap.size);
        if (charsSnap.empty) return;

        let batch = writeBatch(db);
        let ops = 0;
        const BATCH_LIMIT = 400; // keep under 500

        for (const charDoc of charsSnap.docs) {
            const charData = charDoc.data() as any;
            const charId = charData.id ?? charDoc.id;

            // parent is the collection 'character', parent.parent is the user document (id = userEmail)
            const parentDoc = charDoc.ref.parent.parent;
            const userEmail = parentDoc?.id ?? null;

            // best-effort ownerId: prefer existing field, else try to find user by email (costly)
            let ownerId = charData.ownerId ?? null;
            if (!ownerId && userEmail) {
                try {
                    const usersQuery = query(
                        collection(db, 'users'),
                        where('email', '==', userEmail)
                    );
                    const usersSnap = await getDocs(usersQuery);
                    if (!usersSnap.empty) {
                        const u = usersSnap.docs[0];
                        ownerId = (u.data() as any).id ?? u.id;
                    }
                } catch (e) {
                    console.warn('lookup user by email failed', e);
                }
            }

            const payload = {
                ...charData,
                id: charId,
                userEmail,
                ownerId: ownerId ?? null,
                migratedAt: Date.now(),
            };

            batch.set(doc(db, 'characters', charId), payload, { merge: true });
            ops++;

            if (ops >= BATCH_LIMIT) {
                await batch.commit();
                batch = writeBatch(db);
                ops = 0;
            }
        }

        if (ops > 0) await batch.commit();
        console.log('Migration complete ✅');
    } catch (err) {
        console.error('Migration failed', err);
    }
};

export const callAddCharacter = async (
    character: Character,
    dispatch: Dispatch<Action>
) => {
    const user = getAuth().currentUser;

    if (!user?.uid) {
        throw new Error('User not authenticated');
    }

    character.ownerId = user.uid; // Add ownerId during creation time

    await setDoc(doc(db, 'characters', character.id), character)
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

export const callUpdateCharacter = createAsyncThunk(
    'characters/updateCharacter',
    async (character: Character, { rejectWithValue }) => {
        try {
            const characterRef = doc(db, 'characters', character.id);
            await setDoc(characterRef, character, { merge: true });
            Toast.show({
                type: 'success',
                text1: 'Character added successfully!',
            });
            return character;
        } catch (error) {
            console.error('Error updating character in Firestore:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const callRemoveCharacter = async (
    characterId: string,
    dispatch: Dispatch<any>
) => {
    await deleteDoc(doc(db, 'characters', characterId)).then(async () => {
        const storedCharacters = await AsyncStorage.getItem(
            `characters_${characterId}`
        );
        let currentCharacters: Character[] = storedCharacters
            ? JSON.parse(storedCharacters)
            : [];
        currentCharacters = currentCharacters.filter(
            (char) => char.id !== characterId
        );
        await AsyncStorage.setItem(
            `characters_${characterId}`,
            JSON.stringify(currentCharacters)
        );
        dispatch(characterSlice.actions.removeCharacter({ id: characterId }));
        console.log('Character deleted from Firebase');
    });
};

export const callAddNote = async (
    characterId: string,
    note: Note,
    dispatch: Dispatch<any>
) => {
    await addNote(characterId, note, 'characters')
        .then(() => {
            Toast.show({
                type: 'success',
                text1: 'Note saved successfully!',
            });
            dispatch(characterSlice.actions.setNote({ characterId, note }));
        })
        .catch((err) => console.error('Error adding note', err));
};

export const callRemoveNote = async (
    characterId: string,
    noteId: string,
    dispatch: Dispatch<any>
) => {
    await removeNote(characterId, noteId, 'characters')
        .then(() => {
            dispatch(
                characterSlice.actions.removeNote({ characterId, noteId })
            );
            Toast.show({
                type: 'success',
                text1: 'Note deleted successfully!',
            });
        })
        .catch((err) => console.error('Error removing note', err));
};

export const characterSlice = createSlice({
    name: CHARACTER_MODULE_KEY,
    initialState,
    reducers: {
        setCharacter: (state, action: PayloadAction<Character>) => {
            state.characters.push(action.payload);
        },
        updateCharacter: (state, action: PayloadAction<Character>) => {
            const index = state.characters?.findIndex(
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
            const characterIndex = state.characters?.findIndex(
                (char) => char.id === action.payload.characterId
            );

            if (characterIndex !== -1) {
                const character = state.characters[characterIndex];

                const updatedNotes =
                    character.notes?.map((existingNote) =>
                        existingNote.id === action.payload.note.id
                            ? { ...existingNote, ...action.payload.note }
                            : existingNote
                    ) ?? [];

                // If note does not exist, add it
                const noteExists = updatedNotes.some(
                    (existingNote) => existingNote.id === action.payload.note.id
                );

                if (!noteExists) {
                    updatedNotes.unshift(action.payload.note);
                }

                // Update the character with the new notes array
                const updatedCharacter = {
                    ...character,
                    notes: updatedNotes,
                };

                // Update the state immutably
                state.characters = [
                    ...state.characters.slice(0, characterIndex),
                    updatedCharacter,
                    ...state.characters.slice(characterIndex + 1),
                ];
            } else {
                console.error(
                    `Character with ID ${action.payload.characterId} not found.`
                );
            }
        },
        removeNote: (
            state,
            action: PayloadAction<{ characterId: string; noteId: string }>
        ) => {
            const characterIndex = state.characters?.findIndex(
                (char) => char.id === action.payload.characterId
            );
            if (characterIndex !== -1) {
                const character = state.characters[characterIndex];

                if (!character.notes) {
                    character.notes = [];
                }

                character.notes = character.notes.filter(
                    (note) => note.id !== action.payload.noteId
                );
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(callUpdateCharacter.fulfilled, (state, action) => {
                // Update the character in Redux state
                const updatedCharacter = action.payload;
                const index = state.characters.findIndex(
                    (character) => character.id === updatedCharacter.id
                );
                if (index !== -1) {
                    state.characters[index] = updatedCharacter; // Update state
                }
            })
            .addCase(callUpdateCharacter.rejected, (state, action) => {
                state.error = action.payload; // Handle errors
            });
    },
});
