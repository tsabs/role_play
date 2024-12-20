import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userSlice } from './user/slice';
// ...

const rootReducer = combineReducers([userSlice.reducer]);

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: (getDefaultEnhancers) =>
        getDefaultEnhancers.concat(devToolsEnhancer()),
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch'];
