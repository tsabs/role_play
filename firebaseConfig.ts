import { getApp } from '@react-native-firebase/app';
import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import db, {
    disableNetwork,
    enableNetwork,
} from '@react-native-firebase/firestore';

// needed to reconnect firebase if it has gone offline
disableNetwork(db()).then(() => {
    enableNetwork(db());
});

const auth: FirebaseAuthTypes.Module = getAuth(getApp());
export { auth, db };
