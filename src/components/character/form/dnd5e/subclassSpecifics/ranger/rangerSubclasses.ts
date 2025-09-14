export const rangerSubclasses = {
    hunter: {
        nameKey: 'character.classes.ranger.subclasses.hunter.title',
        descriptionKey:
            'character.classes.ranger.subclasses.hunter.description',
        features: [
            {
                level: 3,
                descriptionKey:
                    'character.classes.ranger.subclasses.hunter.features.colossusSlayer',
            },
            {
                level: 7,
                descriptionKey:
                    'character.classes.ranger.subclasses.hunter.features.defensiveTactics',
            },
            // Add more levels as needed
        ],
    },
    beastMaster: {
        nameKey: 'character.classes.ranger.subclasses.beastMaster.title',
        descriptionKey:
            'character.classes.ranger.subclasses.beastMaster.description',
        features: [
            {
                level: 3,
                descriptionKey:
                    'character.classes.ranger.subclasses.beastMaster.features.rangerCompanion',
            },
            {
                level: 7,
                descriptionKey:
                    'character.classes.ranger.subclasses.beastMaster.features.exceptionalTraining',
            },
        ],
    },
};

export const huntersPrey = [
    {
        value: 'colossusSlayer',
        label: 'character.classes.ranger.subclasses.hunter.huntersPrey.colossusSlayer.index',
    },
    {
        value: 'giantKiller',
        label: 'character.classes.ranger.subclasses.hunter.huntersPrey.giantKiller.index',
    },
    {
        value: 'hordeBreaker',
        label: 'character.classes.ranger.subclasses.hunter.huntersPrey.hordeBreaker.index',
    },
];
