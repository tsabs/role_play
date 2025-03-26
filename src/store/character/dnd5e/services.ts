import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

const getBackgrounds = async () => {
    const backgroundsRef = collection(db, 'games', 'dnd5e', 'backgrounds');
    const backgroundsSnapshot = await getDocs(backgroundsRef).catch((err) => {
        console.log(err);
    });
    if (!backgroundsSnapshot) return [];

    return backgroundsSnapshot.docs.map((doc) => doc.data());
};

const getClasses = async () => {
    const classesRef = collection(db, 'games', 'dnd5e', 'classes');
    const classesSnapshot = await getDocs(classesRef);

    return classesSnapshot.docs.map((doc) => doc.data());
};

const getRaces = async () => {
    const racesRef = collection(db, 'games', 'dnd5e', 'races');
    const subRacesRef = collection(db, 'games', 'dnd5e', 'subraces');
    const racesSnapshot = await getDocs(racesRef);
    const subRacesSnapshot = await getDocs(subRacesRef);
    const mergeSnapshot = [...racesSnapshot.docs, ...subRacesSnapshot.docs];
    return mergeSnapshot.map((doc) => doc.data());
};

export { getBackgrounds, getClasses, getRaces };
