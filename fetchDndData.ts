import { db } from './firebaseConfig';
import {
    collection,
    doc,
    setDoc,
    updateDoc,
} from '@react-native-firebase/firestore';
import { DndRace, DndSubRace } from './src/types/games/d2d5e';
const BASE_URL = 'https://www.dnd5eapi.co/api';

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

// export const saveToFirestore = async () => {
//     try {
//         await setDoc(
//             doc(db, 'games', 'dnd5e', 'backgrounds', 'urchin'),
//             urchin
//         );
//     } catch (e) {
//         console.log('error when adding data to firestore', e);
//     }
// };
// export const updateDocument = async () => {
//     try {
//         await updateDoc(doc(db, 'games', 'dnd5e', 'races', 'dragonborn'), {
//             starting_proficiency_options: traitAdaptsToRaceProficienciesOption,
//         });
//     } catch (e) {
//         console.log('error when adding data to firestore', e);
//     }
// };

// export const saveToFirestore = async (category: string) => {
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

// export const saveToFirestore = async (characterClass?: string) => {
//     try {
//         const response = await fetch(`https://www.dnd5eapi.co/api/classes`);
//         const data = await response.json();
//
//         for (const cls of data.results) {
//             const itemData = await fetch(
//                 `${BASE_URL}/classes/${cls.index}/levels`
//             );
//             const itemDataJson = await itemData.json();
//             // console.log('class : ', cls.index);
//             // console.log('class leveling content : ', itemDataJson);
//             for (const level of itemDataJson) {
//                 // console.log('level: ', level.level, level);
//                 await setDoc(
//                     doc(
//                         db,
//                         'games',
//                         'dnd5e',
//                         'classes',
//                         cls.index,
//                         'levels',
//                         `${level.level}`
//                     ),
//                     level
//                 );
//             }
//         }
//
//         console.log('D&D Classes saved to Firestore!');
//     } catch (error) {
//         console.error('Error saving classes:', error);
//     }
// };

// export const callSaveToFireStore = async () => {
//     for (let category of categories) {
//         await saveToFirestore(category);
//     }
//
//     console.log('D&D data imported successfully!');
// };
