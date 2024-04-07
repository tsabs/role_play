import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

interface SignInType {
    auth: Auth;
    email: string;
    password: string;
    setLoading: (value: boolean) => void;
}

export const signIn = async ({ auth, email, password, setLoading }: SignInType) => {
    setLoading(true);
    try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        console.log(response);
    } catch (err) {
        console.log(err);
        alert('SignIn failed: ' + err.message);
    } finally {
        setLoading(false);
    }
};
export const signUp = async ({ auth, email, password, setLoading }: SignInType) => {
    setLoading(true);
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response);
        alert('Check your emails');
    } catch (err) {
        console.log(err);
        alert('SignUp failed: ' + err.message);
    } finally {
        setLoading(false);
    }
};
