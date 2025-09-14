import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from 'types/note';

import { ROLE_SESSIONS_MODULE_KEY } from '../constants';

import { Session, SessionsState } from './types';

declare global {
    interface AppState {
        [ROLE_SESSIONS_MODULE_KEY]?: SessionsState;
    }
}

const initialGamesState: SessionsState = {
    sessions: [],
};

export const sessionSlice = createSlice({
    name: ROLE_SESSIONS_MODULE_KEY,
    initialState: initialGamesState,
    reducers: {
        setSession: (state, action: PayloadAction<Session>) => {
            state.sessions.push(action.payload);
        },
        setSessions: (state, action: PayloadAction<Session[]>) => {
            state.sessions = action.payload;
        },
        removeSession: (state, action: PayloadAction<{ gameId: string }>) => {
            state.sessions = state.sessions.filter(
                (game) => game.id !== action.payload.gameId
            );
        },
        addSessionNote: (
            state,
            action: PayloadAction<{ sessionId: string; note: Note }>
        ) => {
            const session = state.sessions.find(
                (s) => s.id === action.payload.sessionId
            );
            if (session) {
                if (!session.notes) session.notes = [];
                session.notes.unshift(action.payload.note); // Add note to the top
            }
        },
        removeSessionNote: (
            state,
            action: PayloadAction<{ sessionId: string; noteId: string }>
        ) => {
            const session = state.sessions.find(
                (s) => s.id === action.payload.sessionId
            );
            if (session && session.notes) {
                session.notes = session.notes.filter(
                    (note) => note.id !== action.payload.noteId
                );
            }
        },
        updateSessionNote: (
            state,
            action: PayloadAction<{ sessionId: string; note: Note }>
        ) => {
            const session = state.sessions.find(
                (s) => s.id === action.payload.sessionId
            );
            if (session && session.notes) {
                session.notes = session.notes.map((note) =>
                    note.id === action.payload.note.id
                        ? { ...note, ...action.payload.note }
                        : note
                );
            }
        },
        updateSession: (
            state,
            action: PayloadAction<{
                sessionId: string;
                updatedData: Partial<Session>;
            }>
        ) => {
            const sessionIndex = state.sessions.findIndex(
                (session) => session.id === action.payload.sessionId
            );
            if (sessionIndex !== -1) {
                state.sessions[sessionIndex] = {
                    ...state.sessions[sessionIndex],
                    ...action.payload.updatedData,
                };
            }
        },
    },
});
