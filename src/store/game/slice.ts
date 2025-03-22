import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, GamesState } from './types';
import { ROLE_GAMES_MODULE_KEY } from '../constants';

declare global {
    interface AppState {
        [ROLE_GAMES_MODULE_KEY]?: GamesState;
    }
}

const initialGamesState: GamesState = {
    gamesState: [],
};

export const gameSlice = createSlice({
    name: ROLE_GAMES_MODULE_KEY,
    initialState: initialGamesState,
    reducers: {
        setGame: (state, action: PayloadAction<Game>) => {
            state.gamesState.push(action.payload);
            return {
                ...state,
            };
        },
        setGames: (state, action: PayloadAction<Game[]>) => {
            return {
                ...state,
                gamesState: action.payload,
            };
        },
        removeGame: (state, action: PayloadAction<{ gameId: number }>) => {
            const campaigns = state.gamesState.splice(action.payload.gameId, 1);
            return {
                ...state,
                gamesState: campaigns,
            };
        },
    },
});
