export const clericSubclasses = (subclass: string) => ({
    [subclass]: {
        nameKey: `character.classes.cleric.subclasses.${subclass}.title`,
        descriptionKey: `character.classes.cleric.subclasses.${subclass}.description`,
        features: [
            {
                level: 1,
                descriptionKey: `character.classes.cleric.subclasses.${subclass}.features.0`,
            },
            {
                level: 2,
                descriptionKey: `character.classes.cleric.subclasses.${subclass}.features.1`,
            },
            {
                level: 6,
                descriptionKey: `character.classes.cleric.subclasses.${subclass}.features.2`,
            },
            {
                level: 8,
                descriptionKey: `character.classes.cleric.subclasses.${subclass}.features.3`,
            },
            {
                level: 17,
                descriptionKey: `character.classes.cleric.subclasses.${subclass}.features.4`,
            },
        ],
        spells: [
            {
                level: 1,
                spells: [
                    { index: '0', schoolType: 'evocation' },
                    { index: '1', schoolType: 'divination' },
                ],
            },
            {
                level: 3,
                spells: [
                    { index: '0', schoolType: 'transmutation' },
                    { index: '1', schoolType: 'transmutation' },
                ],
            },
            {
                level: 5,
                spells: [
                    { index: '0', schoolType: 'transmutation' },
                    { index: '1', schoolType: 'abjuration' },
                ],
            },
            {
                level: 7,
                spells: [
                    { index: '0', schoolType: 'transmutation' },
                    { index: '1', schoolType: 'evocation' },
                ],
            },
            {
                level: 9,
                spells: [
                    { index: '0', schoolType: 'transmutation' },
                    { index: '1', schoolType: 'illusion' },
                ],
            },
        ],
        divineConduit: [{ level: 2, divineSpells: ['0', '1'] }],
    },
});
