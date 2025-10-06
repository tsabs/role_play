import {
    collection,
    FirestoreError,
    getDocs,
    query,
    where,
} from '@react-native-firebase/firestore';

import { removeDuplicate } from '@utils/utils';

import { db } from '../../../../firebaseConfig';

const getBackgrounds = async () => {
    try {
        const backgroundsRef = collection(db, 'games', 'dnd5e', 'backgrounds');
        const backgroundsSnapshot = await getDocs(backgroundsRef);
        if (!backgroundsSnapshot) return [];

        return backgroundsSnapshot.docs.map((doc) => doc.data());
    } catch (err) {
        console.log(err);
        return [];
    }
};

const getClasses = async () => {
    const classesRef = collection(db, 'games', 'dnd5e', 'classes');
    const classesSnapshot = await getDocs(classesRef);

    return classesSnapshot.docs.map((doc) => doc.data());
};

const getTraits = async () => {
    const traitsRef = collection(db, 'games', 'dnd5e', 'traits');
    const traitsSnapshot = await getDocs(traitsRef);
    return traitsSnapshot.docs.map((doc) => doc.data());
};

const getSkills = async () => {
    const skillsRef = collection(db, 'games', 'dnd5e', 'skills');
    const skillsSnapshot = await getDocs(skillsRef);

    return skillsSnapshot.docs.map((doc) => doc.data());
};

const getRaces = async () => {
    const racesRef = collection(db, 'games', 'dnd5e', 'races');
    const subRacesRef = collection(db, 'games', 'dnd5e', 'subraces');
    const racesSnapshot = await getDocs(racesRef);
    const subRacesSnapshot = await getDocs(subRacesRef);
    const mergeRaces = subRacesSnapshot.docs.map((docSubRace) => {
        const baseRace = racesSnapshot.docs.find(
            (base) =>
                base
                    ?.data()
                    .subraces?.some(
                        (sub) => sub.index === docSubRace?.data()?.index
                    )
        );

        const correspondingSubRace = baseRace
            ?.data()
            ?.subraces.find((sub) => sub.index === docSubRace?.data()?.index);

        if (correspondingSubRace?.index) {
            const abilityBonuses = [
                ...baseRace.data().ability_bonuses,
                ...docSubRace.data().ability_bonuses,
            ];
            const languages = [
                ...baseRace.data().languages,
                ...docSubRace.data().languages,
            ];
            const startingProficiencies = [
                ...baseRace.data().starting_proficiencies,
                ...docSubRace.data().starting_proficiencies,
            ];
            return {
                ...baseRace.data(),
                ...docSubRace.data(),
                ability_bonuses: removeDuplicate(
                    abilityBonuses,
                    'ability_score'
                ),
                languages: removeDuplicate(languages),
                starting_proficiencies: removeDuplicate(startingProficiencies),
            };
        }
        return docSubRace.data();
    });
    const originalRace = racesSnapshot.docs.filter(
        (docRace) => docRace.data().subraces?.length === 0
    );
    return [...originalRace.map((doc) => doc.data()), ...mergeRaces];
};

const getEquipments = async () => {
    const equipmentsRef = collection(db, 'games', 'dnd5e', 'equipment');
    const equipmentsSnapshot = await getDocs(equipmentsRef);

    return equipmentsSnapshot.docs.map((doc) => doc.data());
};

const getEquipmentsFromQueries = async (indexes: string[]) => {
    if (indexes.length === 0) return [];

    const equipmentsRef = collection(db, 'games', 'dnd5e', 'equipment');

    // Firestore allows max 10 elements in `in` query
    const chunks = [];
    for (let i = 0; i < indexes.length; i += 10) {
        chunks.push(indexes.slice(i, i + 10));
    }

    const results: any[] = [];

    for (const chunk of chunks) {
        const q = query(equipmentsRef, where('index', 'in', chunk));
        const snapshot = await getDocs(q);
        results.push(...snapshot.docs.map((doc) => doc.data()));
    }

    return results;
};

/**
 * Fetch features based on class and optionally filter by level and name.
 * @param {string} classIndex - The class index to filter by (required).
 * @param {number} [level] - Optional level to filter features with a level equal or less.
 * @param {string} [name] - Optional name to filter features matching the name.
 * @returns {Promise<any[]>} Array of matching features.
 */
const getFeaturesByClass = async (
    classIndex: string,
    level?: number,
    name?: string
): Promise<any[]> => {
    try {
        const featuresRef = collection(db, 'games', 'dnd5e', 'features');
        let constraints = [where('class.index', '==', classIndex)];

        if (level !== undefined) {
            constraints.push(where('level', '<=', level));
        }
        if (name) {
            constraints.push(where('index', '==', name));
        }

        const featuresQuery = query(featuresRef, ...constraints);
        const snapshot = await getDocs(featuresQuery);

        return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
        const err = error as FirestoreError;
        console.error('Error fetching features:', err.message);
        return [];
    }
};

export {
    getBackgrounds,
    getClasses,
    getRaces,
    getSkills,
    getEquipments,
    getEquipmentsFromQueries,
    getFeaturesByClass,
};
