import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../views/home/Home';
import LoginScreen from '../views/login/Login';
// import { onAuthStateChanged, User } from 'firebase/auth';
//
// import { FIREBASE_AUTH } from '../../firebaseConfig';

const RootStack = createNativeStackNavigator();

type RootStackParamList = {
    Home: {};
    Login: {};
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export default function RouteNavigation() {
    // const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // onAuthStateChanged(FIREBASE_AUTH, (u) => {
        //     console.log('user : ', u)
        //     setUser(u)
        // })
    }, []);

    return (
        <NavigationContainer>
            <RootStack.Navigator id={undefined} initialRouteName="Login">
                <RootStack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <RootStack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Welcome', headerShown: false }}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}
