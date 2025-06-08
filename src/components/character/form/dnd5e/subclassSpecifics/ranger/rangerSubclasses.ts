export const rangerSubclasses = {
    hunter: {
        nameKey: 'character.classes.ranger.subclasses.hunter.name',
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
        nameKey: 'character.classes.ranger.subclasses.beastMaster.name',
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
