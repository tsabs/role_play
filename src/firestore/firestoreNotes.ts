import { updateDoc, doc, getDoc } from '@react-native-firebase/firestore';
import { Note } from 'types/note';

import { db } from '../../firebaseConfig.ts';

export const addNote = async (
    entityId: string,
    note: Note,
    collectionName: string
) => {
    const entityRef = doc(db, collectionName, entityId);
    const entityDoc = await getDoc(entityRef);
    if (entityDoc.exists()) {
        const notes = entityDoc.data().notes || [];

        // Check for existing note and update it
        const updatedNotes = notes.map((existingNote: Note) =>
            existingNote.id === note.id
                ? { ...existingNote, ...note }
                : existingNote
        );

        // Add the note if it doesn't already exist
        const noteExists = notes.some(
            (existingNote: Note) => existingNote.id === note.id
        );

        if (!noteExists) {
            updatedNotes.unshift(note); // Add the new note to the top
        }

        await updateDoc(entityRef, { notes: updatedNotes });
    } else {
        await updateDoc(entityRef, { notes: [note] });
    }
};

export const removeNote = async (
    entityId: string,
    noteId: string,
    collectionName: string
) => {
    const entityRef = doc(db, collectionName, entityId);
    const entityDoc = await getDoc(entityRef);
    if (entityDoc.exists()) {
        const notes = entityDoc.data().notes || [];
        const updatedNotes = notes.filter((note: Note) => note.id !== noteId);
        await updateDoc(entityRef, { notes: updatedNotes });
    }
};

export const updateNote = async (
    entityId: string,
    updatedNote: Note,
    collectionName: string
) => {
    const entityRef = doc(db, collectionName, entityId);
    const entityDoc = await getDoc(entityRef);
    if (entityDoc.exists()) {
        const notes = entityDoc.data().notes || [];
        const updatedNotes = notes.map((note: Note) =>
            note.id === updatedNote.id ? { ...note, ...updatedNote } : note
        );
        await updateDoc(entityRef, { notes: updatedNotes });
    }
};
