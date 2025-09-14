import { ProficiencyOption } from 'types/games/d2d5e';

export type BardSubclassKey = 'lore' | 'valor';

interface BardSubclassFeature {
    level: number;
    titleKey: string;
    descriptionKey: string;
}

interface BardSubclassData {
    nameKey: string;
    descriptionKey: string;
    features: BardSubclassFeature[];
}

export const bardSubclasses: Record<BardSubclassKey, BardSubclassData> = {
    lore: {
        nameKey: 'character.classes.bard.subclasses.lore.title',
        descriptionKey: 'character.classes.bard.subclasses.lore.description',
        features: [
            {
                level: 3,
                titleKey:
                    'character.classes.bard.subclasses.lore.cuttingWordsTitle',
                descriptionKey:
                    'character.classes.bard.subclasses.lore.cuttingWordsDescription',
            },
            {
                level: 3,
                titleKey:
                    'character.classes.bard.subclasses.lore.additionalMastery',
                descriptionKey:
                    'character.classes.bard.subclasses.lore.additionalMasteryDescription',
            },
            {
                level: 6,
                titleKey:
                    'character.classes.bard.subclasses.lore.additionalMagicalSecretsTitle',
                descriptionKey:
                    'character.classes.bard.subclasses.lore.additionalMagicalSecretsDescription',
            },
            {
                level: 14,
                titleKey:
                    'character.classes.bard.subclasses.lore.peerlessSkillTitle',
                descriptionKey:
                    'character.classes.bard.subclasses.lore.peerlessSkillDescription',
            },
        ],
    },
    valor: {
        nameKey: 'character.classes.bard.subclasses.valor.title',
        descriptionKey: 'character.classes.bard.subclasses.valor.description',
        features: [
            {
                level: 3,
                titleKey:
                    'character.classes.bard.subclasses.valor.combatInspirationTitle',
                descriptionKey:
                    'character.classes.bard.subclasses.valor.combatInspirationDescription',
            },
            {
                level: 6,
                titleKey:
                    'character.classes.bard.subclasses.valor.extraAttackTitle',
                descriptionKey:
                    'character.classes.bard.subclasses.valor.extraAttackDescription',
            },
            {
                level: 14,
                titleKey:
                    'character.classes.bard.subclasses.valor.battleMagicTitle',
                descriptionKey:
                    'character.classes.bard.subclasses.valor.battleMagicDescription',
            },
        ],
    },
};

export const loreProficiencyData: ProficiencyOption = {
    choose: 3,
    desc: 'Choose 3 additional mastery',
    desc_fr: 'Choisir 3 maîtrises supplémentaires',
    from: {
        option_set_type: 'options_array',
        options: [
            {
                option_type: 'reference',
                item: {
                    index: 'skill-acrobatics',
                    name: 'Acrobatics',
                    url: '',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'skill-animal-handling',
                    name: 'Animal Handling',
                    url: '',
                },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-arcana', name: 'Arcana', url: '' },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-athletics', name: 'Athletics', url: '' },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-deception', name: 'Deception', url: '' },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-history', name: 'History', url: '' },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-insight', name: 'Insight', url: '' },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'skill-intimidation',
                    name: 'Intimidation',
                    url: '',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'skill-investigation',
                    name: 'Investigation',
                    url: '',
                },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-medicine', name: 'Medicine', url: '' },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-nature', name: 'Nature', url: '' },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'skill-perception',
                    name: 'Perception',
                    url: '',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'skill-performance',
                    name: 'Performance',
                    url: '',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'skill-persuasion',
                    name: 'Persuasion',
                    url: '',
                },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-religion', name: 'Religion', url: '' },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'skill-sleight-of-hand',
                    name: 'Sleight of hand',
                    url: '',
                },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-stealth', name: 'Stealth', url: '' },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-survival', name: 'Survival', url: '' },
            },
        ],
    },
    type: 'proficiencies',
};

const loreExpertiseData: ProficiencyOption = {
    choose: 2,
    desc: 'character.classes.bard.subclasses.lore.expertiseDescription',
    from: {
        option_set_type: 'options_array',
        options: [
            {
                option_type: 'reference',
                item: {
                    index: 'skill-performance',
                    name: 'Performance',
                    url: '',
                },
            },
            {
                option_type: 'reference',
                item: { index: 'skill-insight', name: 'Insight', url: '' },
            },
            // Add more allowed skills for expertise
        ],
    },
    type: 'expertise',
};
