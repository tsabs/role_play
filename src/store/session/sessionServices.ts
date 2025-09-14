import { Dispatch } from 'react';
import {
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    arrayRemove,
} from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import { Action } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Note } from 'types/note';

import { sessionSlice } from '@store/session/slice';

import { db } from '../../../firebaseConfig';
import {
    addNote,
    removeNote,
    updateNote,
} from '../../firestore/firestoreNotes';

import { Session } from './types';

export const createSession = async (
    gmId: string,
    name: string,
    dispatch: Dispatch<Action>,
    gameImgPath?: string,
    gameType?: string
) => {
    const uid = uuidv4();

    const newSession: Session = {
        id: uid,
        gmId,
        name,
        gameImgPath,
        notes: [],
        playerCharacterIds: [],
        invitedPlayerIds: [],
        gameType,
        createdAt: Date.now(),
    };

    await setDoc(doc(db, 'sessions', newSession.id), newSession)
        .then(() => {
            Toast.show({
                type: 'success',
                text1: 'Partie créée avec succès !',
            });
            dispatch(sessionSlice.actions.setSession(newSession));
        })
        .catch((err) => {
            console.error('Error creating session:', err);
            Toast.show({
                type: 'error',
                text1: 'Une erreur est servenue lors de la création de la partie',
            });
        });

    return newSession;
};

export const getSessionsForUser = async (
    userId: string,
    dispatch: Dispatch<Action>
) => {
    const gamesRef = collection(db, 'sessions'); // Reference to the "sessions" collection

    try {
        // Query 1: Sessions where the user is the GM
        const gmQuery = query(gamesRef, where('gmId', '==', userId));
        const gmQuerySnapshot = await getDocs(gmQuery);

        // Query 2: Sessions where the user is invited as a player
        const invitedQuery = query(
            gamesRef,
            where('invitedPlayerIds', 'array-contains', userId)
        );
        const invitedQuerySnapshot = await getDocs(invitedQuery);

        // Combine results from both queries and remove duplicates
        const allSessions: Map<string, Session> = new Map();

        gmQuerySnapshot.forEach((d) => {
            const session = d.data() as Session;
            session.id = d.id; // Ensure session ID is added from Firestore doc ID
            allSessions.set(session.id, session);
        });

        invitedQuerySnapshot.forEach((d) => {
            const session = d.data() as Session;
            session.id = d.id; // Ensure session ID is added from Firestore doc ID
            allSessions.set(session.id, session); // Duplicates automatically handled here
        });

        const sessionsArray = Array.from(allSessions.values());

        // Dispatch these sessions into Redux
        dispatch(sessionSlice.actions.setSessions(sessionsArray));

        console.log('Fetched sessions:', sessionsArray);

        return sessionsArray;
    } catch (error) {
        console.error('Error fetching sessions for user:', error);
        throw error;
    }
};

export const removeSession = async (
    sessionId: string,
    dispatch: Dispatch<Action>
) => {
    const sessionRef = doc(db, 'sessions', sessionId);
    await deleteDoc(sessionRef)
        .then(() => {
            Toast.show({
                type: 'success',
                text1: 'Session supprimée avec succès !',
            });
            dispatch(sessionSlice.actions.removeSession({ gameId: sessionId }));
            console.log(`Session with ID ${sessionId} successfully removed.`);
        })
        .catch((err) => {
            console.error('Error removing session:', err);
            Toast.show({
                type: 'error',
                text1: 'Une erreur est servenue lors de la suppression de la partie',
            });
        });
};

export const inviteCharacterToSession = async (
    sessionId: string,
    characterId: string,
    gmId: string,
    dispatch: Dispatch<Action>
) => {
    const sessionRef = doc(db, 'sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
        Toast.show({
            type: 'error',
            text1: "La partie n'existe pas",
        });
        throw new Error('Session does not exist');
    }
    const session = sessionSnap.data();

    if (session.gmId !== gmId) {
        Toast.show({
            type: 'error',
            text1: 'Seul le MJ peut inviter des joueurs à cette partie',
        });
        throw new Error('Only the GM can invite players to this game');
    }

    const charRef = doc(db, 'characters', characterId);
    const charSnap = await getDoc(charRef);

    if (!charSnap.exists()) {
        Toast.show({
            type: 'error',
            text1: "Le personnage n'existe pas",
        });
        throw new Error('Character not found');
    }
    const charData = charSnap.data();

    if (charData?.ownerId === gmId) {
        Toast.show({
            type: 'error',
            text1: 'Vous ne pouvez pas vous inviter vous-même',
        });
        throw new Error('GM cannot invite themselves');
    }

    console.log('Invite character to session', charData);

    await updateDoc(sessionRef, {
        playerCharacterIds: arrayUnion(characterId),
        invitedPlayerIds: arrayUnion(charData.ownerId),
    })
        .then(() => {
            Toast.show({
                type: 'success',
                text1: 'Personnage invité avec succès !',
            });

            dispatch(
                sessionSlice.actions.updateSession({
                    sessionId,
                    updatedData: {
                        playerCharacterIds: [
                            ...(session.playerCharacterIds || []),
                            characterId,
                        ],
                        invitedPlayerIds: [
                            ...(session.invitedPlayerIds || []),
                            charData.ownerId,
                        ],
                    },
                })
            );
        })
        .catch((err) => {
            console.error(err);
            Toast.show({
                type: 'error',
                text1: "Une erreur est servenue pendant l'invitation du personnage",
            });
        });
};

export const removeCharacterFromSession = async (
    sessionId: string,
    characterId: string,
    ownerId: string,
    dispatch: Dispatch<Action>
) => {
    try {
        // Ensure the session exists
        const sessionRef = doc(db, 'sessions', sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (!sessionSnap.exists()) throw new Error('Session does not exist');

        const session = sessionSnap.data();

        // Update Firestore to remove the character ID
        await updateDoc(sessionRef, {
            invitedPlayerIds: arrayRemove(ownerId),
            playerCharacterIds: arrayRemove(characterId),
        });

        // Update Redux state
        dispatch(
            sessionSlice.actions.updateSession({
                sessionId,
                updatedData: {
                    playerCharacterIds: session.playerCharacterIds.filter(
                        (id: string) => id !== characterId
                    ),
                    invitedPlayerIds: session.invitedPlayerIds.filter(
                        (id: string) => id !== ownerId
                    ),
                },
            })
        );

        console.log(
            `Character ${characterId} successfully removed from session ${sessionId}`
        );
    } catch (error) {
        console.error('Error removing character from session:', error);
    }
};

export const addSessionNote = async (
    sessionId: string,
    note: Note,
    dispatch: Dispatch<any>
) => {
    await addNote(sessionId, note, 'sessions').then(() => {
        Toast.show({
            type: 'success',
            text1: 'Note saved successfully!',
        });
        dispatch(sessionSlice.actions.addSessionNote({ sessionId, note }));
    });
};

export const removeSessionNote = async (
    sessionId: string,
    noteId: string,
    dispatch: Dispatch<any>
) => {
    await removeNote(sessionId, noteId, 'sessions').then(() => {
        Toast.show({
            type: 'success',
            text1: 'Note deleted successfully!',
        });

        dispatch(sessionSlice.actions.removeSessionNote({ sessionId, noteId }));
    });
};

export const updateSessionNote = async (
    sessionId: string,
    updatedNote: Note,
    dispatch: Dispatch<any>
) => {
    await updateNote(sessionId, updatedNote, 'sessions').then(() => {
        Toast.show({
            type: 'success',
            text1: 'Note updated successfully!',
        });
        dispatch(
            sessionSlice.actions.updateSessionNote({
                sessionId,
                note: updatedNote,
            })
        );
    });
};
