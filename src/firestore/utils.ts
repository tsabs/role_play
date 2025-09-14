import { getAuth } from '@react-native-firebase/auth';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';

import { db } from '../../firebaseConfig.ts';

const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0'
    )}`; // e.g. "2025-06"
};

export const canGenerateImage = async (): Promise<boolean> => {
    const user = getAuth().currentUser;
    if (!user) throw new Error('User not authenticated');

    const userDocRef = doc(db, 'users', user.email);
    const snap = await getDoc(userDocRef);
    const currentMonth = getCurrentMonth();

    if (!snap.exists) return true; // first time ever

    const data = snap.data();
    if (data?.imageGenerations?.month !== currentMonth) return true; // new month, reset allowed

    return data?.imageGenerations?.count < 5;
};

export const recordImageGeneration = async (
    prompt: string,
    characterId: string
) => {
    const user = getAuth().currentUser;
    if (!user || !user?.email) throw new Error('User not authenticated');

    const userDocRef = doc(db, 'users', user.email);
    const snap = await getDoc(userDocRef);
    const currentMonth = getCurrentMonth();

    let newCount = 1;
    let previousPrompts: Record<string, string> = {};

    if (snap.exists) {
        const data = snap.data();

        if (data?.imageGenerations?.month === currentMonth) {
            newCount = (data?.imageGenerations?.count || 0) + 1;
            previousPrompts = data.imageGenerations.previousPrompts || {};
        }
    }

    previousPrompts[characterId] = prompt;

    await updateDoc(userDocRef, {
        imageGenerations: {
            month: currentMonth,
            count: newCount,
            previousPrompts,
            lastGenerated: new Date(),
        },
    });
};
