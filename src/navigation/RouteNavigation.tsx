import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../views/home/Home';
import LoginScreen from '../views/login/Login';
// import { onAuthStateChanged, User } from 'firebase/auth';
//
// import { FIREBASE_AUTH } from '../../firebaseConfig';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

const InsideLayout = () => {
    return (
        <InsideStack.Navigator>
            <InsideStack.Screen name={'Home'} component={HomeScreen} />
        </InsideStack.Navigator>
    );
};

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
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Welcome', headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
