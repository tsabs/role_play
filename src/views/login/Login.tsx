import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { CharacterFormProvider } from '@components/character/form/CharacterFormProvider';
import { AuthProps, useAuth } from '@navigation/hook/useAuth';
import { signUpUser, loginUser } from '@store/user/service';

const LoginScreen = () => {
    const navigation = useNavigation();
    const auth: AuthProps = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (auth?.loading !== isLoading) {
            setIsLoading(auth?.loading);
        }
    }, [auth.loading, isLoading]);

    const signUp = useCallback(
        async () =>
            await signUpUser({ email, password })
                .then(() =>
                    navigation.navigate('ProtectedScreen', {
                        screen: CharacterFormProvider,
                    })
                )
                .catch((err) => {
                    Toast.show({
                        type: 'error',
                        text1: 'La création du compte a échoué',
                        text2: `Une erreur est survenue: ${err}`,
                    });
                })
                .finally(() => setIsLoading(false)),
        [email, password, navigation]
    );

    const loginIn = useCallback(async () => {
        await loginUser({ email, password })
            .then(() => {
                navigation.navigate('ProtectedScreen', {
                    screen: CharacterFormProvider,
                });
            })
            .catch(() => {
                Toast.show({
                    type: 'error',
                    text1: 'La connexion  a échoué',
                    text2: 'Veuillez vérifier vos identifiants.',
                });
            })
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
                secureTextEntry
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
