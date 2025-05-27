import { db } from './firebaseConfig';
import {
    collection,
    doc,
    setDoc,
    updateDoc,
} from '@react-native-firebase/firestore';
import { DndRace, DndSubRace } from './src/types/games/d2d5e';
const BASE_URL = 'https://www.dnd5eapi.co/api';

const halfelinRobuste: DndSubRace = {
    ability_bonuses: [
        { bonus: 2, ability_score: { name: 'DEX', index: 'dex' } },
        { bonus: 1, ability_score: { name: 'CON', index: 'con' } },
    ],
    index: 'stout-halfling',
    languages: [
        { name: 'Commun', index: 'common' },
        { name: 'Halfelin', index: 'halfling' },
    ],
    name: 'Stout Halfling',
    starting_proficiencies: [],
    racial_traits: [
        { name: 'Robustesse des robustes', index: 'stout-resilience' },
    ],
    updated_at: '2025-05-20T00:00:00Z',
    url: '/api/subraces/halfelin-robuste',
};

const traitAdaptsToRaceProficienciesOption = {
    choose: 1,
    from: {
        option_set_type: 'options_array',
        options: [
            {
                option_type: 'reference',
                item: {
                    index: 'draconic-ancestry-black',
                    name: 'Draconic Ancestry (Black)',
                    url: '/api/2014/traits/draconic-ancestry-black',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'draconic-ancestry-blue',
                    name: 'Draconic Ancestry (Blue)',
                    url: '/api/2014/traits/draconic-ancestry-blue',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'draconic-ancestry-brass',
                    name: 'Draconic Ancestry (Brass)',
                    url: '/api/2014/traits/draconic-ancestry-brass',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'draconic-ancestry-bronze',
                    name: 'Draconic Ancestry (Bronze)',
                    url: '/api/2014/traits/draconic-ancestry-bronze',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'draconic-ancestry-copper',
                    name: 'Draconic Ancestry (Copper)',
                    url: '/api/2014/traits/draconic-ancestry-copper',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'draconic-ancestry-gold',
                    name: 'Draconic Ancestry (Gold)',
                    url: '/api/2014/traits/draconic-ancestry-gold',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'draconic-ancestry-green',
                    name: 'Draconic Ancestry (Green)',
                    url: '/api/2014/traits/draconic-ancestry-green',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'draconic-ancestry-red',
                    name: 'Draconic Ancestry (Red)',
                    url: '/api/2014/traits/draconic-ancestry-red',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'draconic-ancestry-silver',
                    name: 'Draconic Ancestry (Silver)',
                    url: '/api/2014/traits/draconic-ancestry-silver',
                },
            },
            {
                option_type: 'reference',
                item: {
                    index: 'draconic-ancestry-white',
                    name: 'Draconic Ancestry (White)',
                    url: '/api/2014/traits/draconic-ancestry-white',
                },
            },
        ],
    },
};

// List of D&D 5E categories to fetch
const categories = [
    // 'spells',
    // 'classes',
    // 'races',
    // 'monsters',
    // 'equipment',
    // 'features',
    // 'backgrounds',
    // 'skills',
    // 'traits',
    // 'ability-scores',
    // 'magic-schools',
    // 'subraces',
];

export const saveToFirstore = async () => {
    try {
        await setDoc(
            doc(db, 'games', 'dnd5e', 'races', 'dragonborn'),
            traitAdaptsToRaceProficienciesOption
        );
    } catch (e) {
        console.log('error when adding data to firestore', e);
    }
};
export const updateDocument = async () => {
    try {
        await updateDoc(doc(db, 'games', 'dnd5e', 'races', 'dragonborn'), {
            starting_proficiency_options: traitAdaptsToRaceProficienciesOption,
        });
    } catch (e) {
        console.log('error when adding data to firestore', e);
    }
};

// const saveToFirestore = async (category: string) => {
//     try {
//         const response = await fetch(`https://www.dnd5eapi.co/api/${category}`);
//         const data = await response.json();
//
//         for (const cls of data.results) {
//             const itemData = await fetch(
//                 `${BASE_URL}/${category}/${cls.index}`
//             );
//             const itemDataJson = await itemData.json();
//             await setDoc(
//                 doc(db, 'games', 'dnd5e', category, itemDataJson.index),
//                 itemDataJson
//             );
//         }
//
//         console.log('D&D Classes saved to Firestore!');
//     } catch (error) {
//         console.error('Error saving classes:', error);
//     }
// };

export const saveToFirestore = async (characterClass?: string) => {
    try {
        const response = await fetch(`https://www.dnd5eapi.co/api/classes`);
        const data = await response.json();

        for (const cls of data.results) {
            const itemData = await fetch(
                `${BASE_URL}/classes/${cls.index}/levels`
            );
            const itemDataJson = await itemData.json();
            // console.log('class : ', cls.index);
            // console.log('class leveling content : ', itemDataJson);
            for (const level of itemDataJson) {
                // console.log('level: ', level.level, level);
                await setDoc(
                    doc(
                        db,
                        'games',
                        'dnd5e',
                        'classes',
                        cls.index,
                        'levels',
                        `${level.level}`
                    ),
                    level
                );
            }
        }

        console.log('D&D Classes saved to Firestore!');
    } catch (error) {
        console.error('Error saving classes:', error);
    }
};

export const callSaveToFireStore = async () => {
    for (let category of categories) {
        await saveToFirestore(category);
    }

    console.log('D&D data imported successfully!');
};
