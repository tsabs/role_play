import { GAME_TYPE, GenericCharacter } from '../generic';

type WarHammerAbility = 'CC' | 'CT';

interface WarHammerConfig {
    ability: WarHammerAbility;
    abilities: Record<WarHammerAbility, number>;
    race: string; // WarHammerRace;
    className: string; // WarHammerClassName;
    background: string; // WarHammerBackground;
    gameType: GAME_TYPE.WAR_HAMMER;
}

type WarHammerCharacter = GenericCharacter<WarHammerConfig>;

export { WarHammerAbility, WarHammerCharacter };
