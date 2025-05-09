import { GAME_TYPE, GenericCharacter } from '../generic';

type WarHammerAbility = 'CC' | 'CT';

interface WarHammerCharacter extends GenericCharacter<WarHammerAbility> {
    abilities: Record<WarHammerAbility, number>;
    gameType: GAME_TYPE.WAR_HAMMER;
}

export { WarHammerAbility, WarHammerCharacter };
