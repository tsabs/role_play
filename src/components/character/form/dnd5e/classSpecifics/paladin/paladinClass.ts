export const paladinSubclasses = (subclass: string) => ({
    [subclass]: {
        nameKey: `character.classes.paladin.subclasses.${subclass}.title`,
        descriptionKey: `character.classes.paladin.subclasses.${subclass}.description`,
        features: [
            {
                level: 3,
                descriptionKey: `character.classes.paladin.subclasses.${subclass}.features.0`,
            },
            {
                level: 7,
                descriptionKey: `character.classes.paladin.subclasses.${subclass}.features.1`,
            },
        ],
        spells: [
            {
                level: 3,
                spells: [
                    {
                        index: '0',
                        schoolType: 'abjuration',
                    },
                    { index: '1', schoolType: 'abjuration' },
                ],
            },
            {
                level: 5,
                spells: [
                    {
                        index: '0',
                        schoolType: 'abjuration',
                    },
                    { index: '1', schoolType: 'enchantement' },
                ],
            },
            {
                level: 9,
                spells: [
                    {
                        index: '0',
                        schoolType: 'abjuration',
                    },
                    { index: '1', schoolType: 'abjuration' },
                ],
            },
        ],
        divineConduit: {
            level: 3,
            abilities: [`0`, `1`],
        },
    },
});
