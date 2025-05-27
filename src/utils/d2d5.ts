import { DnDAbility, SkillProficiency } from '../types/games/d2d5e';
import { Ability } from '../types/generic';

export const maxLevels = Array.from({ length: 20 }, (_, i) => {
    const label = i + 1;
    return { label: label.toString(), value: i + 1 };
});

export const getPointBuyCost = (score: number): number => {
    switch (score) {
        case 8:
            return 0;
        case 9:
            return 1;
        case 10:
            return 2;
        case 11:
            return 3;
        case 12:
            return 4;
        case 13:
            return 5;
        case 14:
            return 7;
        case 15:
            return 9;
        default:
            return Infinity; // prevent going beyond 15
    }
};

export const MIN_SCORE = 8;
export const MAX_SCORE = 15;
export const TOTAL_BUY_POINTS = 27;

export const totalCost = (ability: Record<DnDAbility, number>) =>
    Object.values(ability).reduce(
        (acc, score) => acc + getPointBuyCost(score),
        0
    );

export const remainingPoints = (ability: Record<DnDAbility, number>) =>
    TOTAL_BUY_POINTS - totalCost(ability);

export const transformRaceAbilities = (
    abilities: {
        ability_score: { index: string };
        bonus?: number;
    }[]
): Array<{ index: string; bonus?: number }> =>
    abilities.map((item) => ({
        index: item.ability_score.index,
        bonus: item.bonus ?? 0,
    }));

export const mergeAbilityBonuses = (
    base: Array<{ index: string; bonus?: number }>,
    extra: Array<{ index: string; bonus?: number }>
): Array<{ index: string; bonus?: number }> => {
    const mergedMap = new Map<string, number>();

    [...base, ...extra].forEach(({ index, bonus = 0 }) => {
        const existing = mergedMap.get(index) ?? 0;
        mergedMap.set(index, existing + bonus);
    });

    return Array.from(mergedMap.entries()).map(([index, bonus]) => ({
        index,
        bonus,
    }));
};

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

export { calculateModifier, getSkillModifier };
