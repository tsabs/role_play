export const warlockClasses = (subclass: string) => ({
    nameKey: `character.classes.warlock.subclasses.${subclass}.title`,
    descriptionKey: `character.classes.warlock.subclasses.${subclass}.description`,
    features: [
        {
            level: 1,
            descriptionKey: `character.classes.warlock.subclasses.${subclass}.features.0`,
        },
        {
            level: 2,
            descriptionKey: `character.classes.warlock.subclasses.${subclass}.features.1`,
        },
        {
            level: 6,
            descriptionKey: `character.classes.warlock.subclasses.${subclass}.features.2`,
        },
    ],
    eldritchInvocations: [
        { level: 2, count: 2 },
        { level: 5, count: 3 },
        { level: 7, count: 4 },
        { level: 9, count: 5 },
        { level: 12, count: 6 },
        { level: 15, count: 7 },
        { level: 18, count: 8 },
    ],
    spells: [],
});

export const patronPacts = [
    {
        value: 'blade',
        label: 'character.classes.warlock.patronPacts.blade.index',
    },
    {
        value: 'chain',
        label: 'character.classes.warlock.patronPacts.chain.index',
    },
    {
        value: 'tome',
        label: 'character.classes.warlock.patronPacts.tome.index',
    },
];
