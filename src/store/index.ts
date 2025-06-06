import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userSlice } from './user/slice';
import { characterSlice } from './character/slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { CHARACTER_MODULE_KEY, LOGIN_MODULE_KEY } from './constants';
// ...

const rootReducer = combineReducers({
    [LOGIN_MODULE_KEY]: userSlice.reducer,
    [CHARACTER_MODULE_KEY]: characterSlice.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: (getDefaultEnhancers) =>
        getDefaultEnhancers.concat(devToolsEnhancer()),
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `AppState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<AppStore['getState']>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch'];

// Redux hook
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
