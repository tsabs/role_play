import { Note } from './note';
import { DnDAbility, DnDCharacter } from './games/d2d5e';
import { WarHammerAbility, WarHammerCharacter } from './games/warHammer';

enum GAME_TYPE {
    DND5E = 'dnd5e',
    WAR_HAMMER = 'warHammer',
}

type Ability = DnDAbility | WarHammerAbility;

interface GenericCharacter<T extends Ability> {
    id: string;
    name: string;
    userEmail: string;
    description: string;
    background: string;
    abilities: Record<T, number>;
    // Cause DnD has background as talent this is actually the user imagined background
    race: string;
    className: string;
    gameType: GAME_TYPE;
    characterImg?: string;
    gameId?: string;
    additionalBackground?: string;
    notes?: Note[];
}

type Character = DnDCharacter | WarHammerCharacter;

export { GenericCharacter, Character, Ability, GAME_TYPE };
