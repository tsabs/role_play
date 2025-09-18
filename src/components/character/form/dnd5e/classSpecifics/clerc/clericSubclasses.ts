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
            { level: 1, spells: ['0', '1'] },
            { level: 3, spells: ['0', '1'] },
            { level: 5, spells: ['0', '1'] },
            { level: 7, spells: ['0', '1'] },
            { level: 9, spells: ['0', '1'] },
        ],
        divineConduit: [{ level: 2, divineSpells: ['0', '1'] }],
    },
});
