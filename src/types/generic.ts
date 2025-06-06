import { Note } from './note';
import { DnDAbility, DnDCharacter } from './games/d2d5e';
import { WarHammerAbility, WarHammerCharacter } from './games/warHammer';

enum GAME_TYPE {
    DND5E = 'dnd5e',
    WAR_HAMMER = 'warHammer',
}

type Ability = DnDAbility | WarHammerAbility;

type Character = DnDCharacter | WarHammerCharacter;

interface GenericCharacter<
    Config extends {
        gameType: GAME_TYPE;
        abilities: any;
        race: any;
        className: any;
        background: any;
    },
> {
    id: string;
    name: string;
    userEmail: string;
    description: string;
    level: number;

    gameType: Config['gameType'];
    abilities: Config['abilities'];
    race: Config['race'];
    selectedRaceElements?: Config extends { selectedRaceElements: any }
        ? Config['selectedRaceElements']
        : never;
    className: Config['className'];
    selectedClassElements?: Config extends { selectedClassElements: any }
        ? Config['selectedClassElements']
        : never;
    background: Config['background'];
    selectedBackgroundElements?: Config extends {
        selectedBackgroundElements: any;
    }
        ? Config['selectedBackgroundElements']
        : never;
    // Cause DnD has background as talent this is actually the user imagined background
    characterImg?: string;
    gameId?: string;
    additionalBackground?: string;
    notes?: Note[];
}

export { GenericCharacter, Character, Ability, GAME_TYPE };
