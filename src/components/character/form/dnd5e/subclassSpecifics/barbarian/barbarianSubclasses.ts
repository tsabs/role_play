export const barbarianSubclasses = {
    berserker: {
        nameKey: 'character.classes.barbarian.subclasses.berserker.title',
        descriptionKey:
            'character.classes.barbarian.subclasses.berserker.description',
        features: [
            {
                level: 3,
                descriptionKey:
                    'character.classes.barbarian.subclasses.berserker.frenzy',
            },
            {
                level: 6,
                descriptionKey:
                    'character.classes.barbarian.subclasses.berserker.mindlessRage',
            },
            // Add more as needed
        ],
    },
    totem: {
        nameKey: 'character.classes.barbarian.subclasses.totem.title',
        descriptionKey:
            'character.classes.barbarian.subclasses.totem.description',
        features: [
            {
                level: 3,
                descriptionKey:
                    'character.classes.barbarian.subclasses.totem.spiritAnimal',
            },
            {
                level: 6,
                descriptionKey:
                    'character.classes.barbarian.subclasses.totem.aspectOfTheBeast',
            },
        ],
    },
} as const;

export const totemAnimalData = [
    {
        value: 'bear',
        label: 'character.classes.barbarian.subclasses.totem.spiritAnimalFeatures.bear.index',
    },
    {
        value: 'wolf',
        label: 'character.classes.barbarian.subclasses.totem.spiritAnimalFeatures.wolf.index',
    },
    {
        value: 'eagle',
        label: 'character.classes.barbarian.subclasses.totem.spiritAnimalFeatures.eagle.index',
    },
];
