import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LOGIN_MODULE_KEY } from '../constants';
import { UserState } from './types';

declare global {
    interface AppState {
        [LOGIN_MODULE_KEY]?: UserState;
    }
}

const userInitialState: UserState = {
    userName: '',
    email: '',
    password: '',
};

export const userSlice = createSlice({
    name: LOGIN_MODULE_KEY,
    initialState: userInitialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            return {
                userName: action.payload.userName,
                email: action.payload.email,
                password: state.password,
            };
        },
    },
});
