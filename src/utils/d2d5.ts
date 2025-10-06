import Fuse from 'fuse.js';

import rawData from '../../assets/llmRelated/corpus_dd5_structuredEn.json';
import {
    DnDAbility,
    DnDCharacter,
    ProficiencyOption,
    SkillProficiency,
} from '../types/games/d2d5e';
import { Ability } from '../types/generic';

export const maxLevels = Array.from({ length: 20 }, (_, i) => {
    const label = i + 1;
    return { label: label.toString(), value: i + 1, selectable: true };
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

export const getProficiencyBonus = (level: number) =>
    Math.floor((level - 1) / 4) + 2;

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

const subclassLevelByClass: Record<string, number> = {
    barbarian: 3,
    bard: 3,
    cleric: 1,
    fighter: 3,
    paladin: 3,
    ranger: 3,
    sorcerer: 1,
    warlock: 1,
    // ...others
};

const shouldChooseSubclass = (
    characterClass: string,
    level: number
): boolean => {
    const requiredLevel = subclassLevelByClass[characterClass];
    return requiredLevel !== undefined && level >= requiredLevel;
};

type ProficiencyCategory = 'race' | 'class' | 'background';

export interface ExtractedProficiencies {
    fromBackground?: string[];
    fromRace?: string[];
    fromSelectedRace?: string[];
    fromSelectedClass?: string[];
    fromSelectedSubclass?: string[];
    fromSelectedSubclassExpertise?: string[];
    all: string[]; // flat list, unique
}

/**
 * Extracts all proficiencies (mainly skill-*) selected or granted from character data.
 */
const extractCharacterProficiencies = (character: DnDCharacter) => {
    const fromBackground =
        character.background?.starting_proficiencies?.flatMap((prof) => {
            if (prof.index?.includes('skill-')) {
                return [prof.index.split('skill-')[1]];
            }
            return [];
        }) || [];

    const fromRace =
        character.race?.starting_proficiencies?.flatMap((prof) => {
            if (prof.index?.includes('skill-')) {
                return [prof.index.split('skill-')[1]];
            }
            return [];
        }) || [];

    const fromSelectedRace =
        character.selectedRaceElements?.raceChoices?.[
            `${character.race?.index}-race-proficiencies`
        ]?.map((prof) => prof.index) || [];

    const fromSelectedClass =
        character.selectedClassElements?.classChoices?.[
            `${character.className?.index}-class-0`
        ]?.map((prof) => prof.index) || [];

    const fromSelectedSubclass =
        character.selectedClassElements?.classChoices?.[
            `${character.selectedClassElements?.selected_subclass}-extra-proficiencies`
        ]?.map((prof) => prof.index) || [];

    const fromSelectedSubclassExpertise =
        character.selectedClassElements?.classChoices?.['expertise']?.map(
            (expertise) => expertise.index
        ) || [];

    return {
        fromBackground,
        fromRace,
        fromSelectedRace,
        fromSelectedClass,
        fromSelectedSubclass,
        fromSelectedSubclassExpertise,
        all: [
            ...fromBackground,
            ...fromRace,
            ...fromSelectedRace,
            ...fromSelectedClass,
            ...fromSelectedSubclass,
        ],
    };
};

const getProficienciesToExpertise = (
    data: ProficiencyOption,
    extractedProficiencies: ExtractedProficiencies,
    excludeSources: (keyof ExtractedProficiencies)[] = []
): ProficiencyOption => {
    const combinedProficiencies = Object.entries(extractedProficiencies)
        .filter(
            ([key]) =>
                key !== 'all' &&
                key !== 'fromSelectedSubClassExpertise' &&
                !excludeSources.includes(key as keyof ExtractedProficiencies)
        )
        .flatMap(([, profs]) => profs || []);

    const ownedSkills = new Set(combinedProficiencies);

    const filteredOptions = data.from.options.filter((option) => {
        if (option.option_type === 'reference') {
            const skillIndex = option.item.index.includes('skill-')
                ? option.item.index.split('skill-')[1]
                : option.item.index;

            return ownedSkills.has(skillIndex);
        }

        if (option.option_type === 'string') {
            const optionSelect = option as any;
            return ownedSkills.has(optionSelect.index);
        }

        return false;
    });

    return {
        ...data,
        from: {
            ...data.from,
            options: filteredOptions,
        },
    };
};

const getAvailableProficiencies = (
    data: ProficiencyOption,
    extractedProficiencies: ExtractedProficiencies,
    excludeSources: (keyof ExtractedProficiencies)[] = []
): ProficiencyOption => {
    const combinedProficiencies = Object.entries(extractedProficiencies)
        .filter(
            ([key]) =>
                key !== 'all' &&
                !excludeSources.includes(key as keyof ExtractedProficiencies)
        )
        .flatMap(([, profs]) => profs || []);

    const ownedSkills = new Set(combinedProficiencies);

    const filteredOptions = data.from.options.filter((option) => {
        if (option.option_type === 'reference') {
            const skillIndex = option.item.index.includes('skill-')
                ? option.item.index.split('skill-')[1]
                : option.item.index;
            return !ownedSkills.has(skillIndex);
        }

        if (option.option_type === 'string') {
            const optionSelect = option as any;
            return !ownedSkills.has(optionSelect.index);
        }

        return true; // Keep other types
    });

    return {
        ...data,
        from: {
            ...data.from,
            options: filteredOptions,
        },
    };
};

type DataCategory = 'spells' | 'feats' | 'races' | 'classes';

const categories: { label: string; value: DataCategory }[] = [
    { label: 'Sort', value: 'spells' },
    { label: 'Classe', value: 'classes' },
    { label: 'Race', value: 'races' },
    { label: 'Don', value: 'feats' },
];

const detectCategory = (input: string): DataCategory | null => {
    const lower = input.toLowerCase();
    if (lower.includes('sort')) return 'spells';
    if (lower.includes('talent')) return 'feats';
    if (lower.includes('race')) return 'races';
    if (lower.includes('classe')) return 'classes';
    return null;
};

const findItemByName = (category: DataCategory, name: string) => {
    const dataCategory = [...rawData[category]];

    const fuse = new Fuse(dataCategory, {
        keys: ['name', 'slug'],
        threshold: 0.3,
    });

    const fuseResults = fuse.search(name.toLocaleLowerCase());
    console.log('fuseResults', fuseResults);
    if (fuseResults.length) return fuseResults;
    return rawData[category].filter((item) =>
        name.includes(item.name.toLowerCase())
    );
};

export {
    calculateModifier,
    categories,
    DataCategory,
    detectCategory,
    findItemByName,
    getSkillModifier,
    shouldChooseSubclass,
    extractCharacterProficiencies,
    getAvailableProficiencies,
    getProficienciesToExpertise,
};
