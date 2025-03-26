import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
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

const saveToFirestore = async (category: string) => {
    try {
        const response = await fetch(`https://www.dnd5eapi.co/api/${category}`);
        const data = await response.json();

        for (const cls of data.results) {
            const itemData = await fetch(
                `${BASE_URL}/${category}/${cls.index}`
            );
            const itemDataJson = await itemData.json();
            await setDoc(
                doc(db, 'games', 'dnd5e', category, itemDataJson.index),
                itemDataJson
            );
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
