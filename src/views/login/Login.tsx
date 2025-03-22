import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { signUpUser, loginUser } from '../../store/user/service';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const signUp = useCallback(
        async () =>
            await signUpUser({ email, password, role: 'player' })
                .then(() => navigation.navigate('Home'))
                .finally(() => setIsLoading(false)),
        [email, password, navigation]
    );

    const loginIn = useCallback(async () => {
        await loginUser({ email, password })
            .then(() => navigation.navigate('Home'))
            .finally(() => setIsLoading(false));
    }, [email, password, navigation]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
            ></TextInput>
            <TextInput
                style={styles.input}
                placeholder="password"
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
            ></TextInput>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View>
                    <Button onPress={loginIn}>
                        <Text>Sign In</Text>
                    </Button>
                    <Button onPress={signUp}>
                        <Text>Sign Up</Text>
                    </Button>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    input: {},
    buttonContainer: {
        width: '100%',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
    },
});

export default LoginScreen;
