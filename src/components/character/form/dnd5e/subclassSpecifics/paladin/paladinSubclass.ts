export const paladinSubclasses = {
    devotion: {
        nameKey: 'character.classes.paladin.subclasses.devotion.title',
        descriptionKey:
            'character.classes.paladin.subclasses.devotion.description',
        features: [
            {
                level: 3,
                descriptionKey:
                    'character.classes.paladin.subclasses.devotion.feature1',
            },
            {
                level: 7,
                descriptionKey:
                    'character.classes.paladin.subclasses.devotion.feature2',
            },
        ],
        oathSpells: [
            {
                level: 3,
                spells: ['protection-from-evil-and-good', 'sanctuary'],
            },
            { level: 5, spells: ['lesser-restoration', 'zone-of-truth'] },
        ],
        channelDivinity: {
            level: 3,
            abilities: [
                'character.classes.paladin.subclasses.devotion.channelDivinity.sacredWeapon',
                'character.classes.paladin.subclasses.devotion.channelDivinity.turnUnholy',
            ],
        },
    },
    ancients: {
        nameKey: 'character.classes.paladin.subclasses.ancients.title',
        descriptionKey:
            'character.classes.paladin.subclasses.ancients.description',
        features: [
            {
                level: 3,
                descriptionKey:
                    'character.classes.paladin.subclasses.ancients.feature1',
            },
            {
                level: 7,
                descriptionKey:
                    'character.classes.paladin.subclasses.ancients.feature2',
            },
        ],
        oathSpells: [
            { level: 3, spells: ['bane', 'hunter’s-mark'] },
            { level: 5, spells: ['hold-person', 'misty-step'] },
        ],
        channelDivinity: {
            level: 3,
            abilities: [
                'character.classes.paladin.subclasses.ancients.channelDivinity.natureWrath',
                'character.classes.paladin.subclasses.ancients.channelDivinity.turnFey',
            ],
        },
    },
    vengeance: {
        nameKey: 'character.classes.paladin.subclasses.vengeance.title',
        descriptionKey:
            'character.classes.paladin.subclasses.vengeance.description',
        features: [
            {
                level: 3,
                descriptionKey:
                    'character.classes.paladin.subclasses.vengeance.feature1',
            },
            {
                level: 7,
                descriptionKey:
                    'character.classes.paladin.subclasses.vengeance.feature2',
            },
        ],
        oathSpells: [
            { level: 3, spells: ['ensnaring-strike', 'speak-with-animals'] },
            { level: 5, spells: ['moonbeam', 'misty-step'] },
        ],
        channelDivinity: {
            level: 3,
            abilities: [
                'character.classes.paladin.subclasses.vengeance.channelDivinity.abjureEnemy',
                'character.classes.paladin.subclasses.vengeance.channelDivinity.vowOfEnmity',
            ],
        },
    },
};
