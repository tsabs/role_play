import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '../index';
import { CHARACTER_MODULE_KEY } from '../constants';

const selectCharacterState = (state: AppState) => state?.[CHARACTER_MODULE_KEY];

export const selectAllCharacters = createSelector(
    selectCharacterState,
    (charactersState) => charactersState?.characters
);
