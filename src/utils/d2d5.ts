import { SkillProficiency } from '../types/games/d2d5e';
import { Ability } from '../types/generic';

const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

const getProficiencyBonus = (level: number) => Math.floor((level - 1) / 4) + 2;

const getSkillModifier = (
    skill: SkillProficiency,
    abilities: Record<Ability, number>,
    level: number
): number => {
    const mod = calculateModifier(abilities[skill.ability]);
    const profBonus = getProficiencyBonus(level);
    if (skill.isExpert) return mod + profBonus * 2;
    if (skill.isProficient) return mod + profBonus;
    return mod;
};

export { getSkillModifier };
