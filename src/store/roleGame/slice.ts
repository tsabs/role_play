import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoleGame, RoleGamesState } from '../../types/roleGameTypes';
import { ROLE_GAMES_MODULE_KEY } from '../constants';

declare global {
    interface AppState {
        [ROLE_GAMES_MODULE_KEY]?: RoleGamesState;
    }
}

const initialRoleGamesState: RoleGamesState = {
    roleGamesState: [],
};

export const roleGameSlice = createSlice({
    name: ROLE_GAMES_MODULE_KEY,
    initialState: initialRoleGamesState,
    reducers: {
        setRoleGame: (state, action: PayloadAction<RoleGame>) => {
            state.roleGamesState.push(action.payload);
            return {
                ...state,
            };
        },
        setRoleGames: (state, action: PayloadAction<RoleGame[]>) => {
            return {
                ...state,
                roleGamesState: action.payload,
            };
        },
        removeRoleGame: (
            state,
            action: PayloadAction<{ roleGameId: number }>
        ) => {
            const campaigns = state.roleGamesState.splice(
                action.payload.roleGameId,
                1
            );
            return {
                ...state,
                roleGamesState: campaigns,
            };
        },
    },
});
