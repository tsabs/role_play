import { collection, getDocs } from '@react-native-firebase/firestore';

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

export { getBackgrounds, getClasses, getRaces, getSkills };
