import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';

import { Home, Login } from '../views';
import { FIREBASE_AUTH } from '../../firebaseConfig';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

const InsideLayout = () => {
    return (
        <InsideStack.Navigator>
            <InsideStack.Screen name={'Home'} component={Home} />
        </InsideStack.Navigator>
    );
};

export default function RouteNavigation() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (u) => {
            console.log('user : ', u);
            setUser(u);
        });
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {user ? (
                    <Stack.Screen
                        name="Inside"
                        component={InsideLayout}
                        options={{ title: 'Yo', headerShown: false }}
                    />
                ) : (
                    <Stack.Screen name="Login" component={Login} options={{ title: 'Yo', headerShown: false }} />
                )}
                {/*<Stack.Screen name="Login" component={Login} options={{ title: 'Yo', headerShown: false }} />*/}
                {/*<Stack.Screen name="Home" component={InsideLayout} options={{ title: 'Welcome' }} />*/}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
