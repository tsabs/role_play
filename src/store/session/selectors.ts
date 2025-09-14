import { createSelector } from '@reduxjs/toolkit';

import { ROLE_SESSIONS_MODULE_KEY } from '@store/constants';

export const selectSessionsState = (state: AppState) =>
    state[ROLE_SESSIONS_MODULE_KEY];

export const selectSessions = createSelector(
    selectSessionsState,
    (sessionsState) => sessionsState?.sessions
);

export const selectNotes = (sessionId: string) => {
    return createSelector(selectSessions, (sessions) => {
        return sessions?.find((session) => session.id === sessionId)?.notes;
    });
};

export const selectSessionByGameMaster = (gmId: string) =>
    createSelector(selectSessions, (games) =>
        games.filter((game) => game.gmId === gmId)
    );
