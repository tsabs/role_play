import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
interface SignInType {
    email: string;
    password: string;
    navigation: NavigationProp<any>;
    setLoading: (value: boolean) => void;
}
export const signIn = async ({
    email,
    password,
    navigation,
    setLoading,
}: SignInType) => {
    setLoading(true);
    try {
        // const response = await signInWithEmailAndPassword(auth, email, password)
        navigation.navigate('Home');
        console.log('sign in', email, password);
    } catch (err) {
        console.log(err);
        alert('SignIn failed: ' + err.message);
    } finally {
        setLoading(false);
    }
};
export const signUp = async ({
    email,
    password,
    navigation,
    setLoading,
}: SignInType) => {
    setLoading(true);
    try {
        // const response = await createUserWithEmailAndPassword(
        //     auth,
        //     email,
        //     password
        // )
        navigation.navigate('Home');
    } catch (err) {
        console.log(err);
        alert('SignUp failed: ' + err.message);
    } finally {
        setLoading(false);
    }
};

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <View style={styles.container}>
            <TextInput
                // style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
            ></TextInput>
            <TextInput
                // style={styles.input}
                placeholder="password"
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
            ></TextInput>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View>
                    <Button
                        onPress={() =>
                            signUp({
                                email,
                                password,
                                setLoading,
                                navigation,
                            })
                        }
                    >
                        <Text>Sign In</Text>
                    </Button>
                    <Button
                        onPress={() =>
                            signIn({
                                email,
                                password,
                                setLoading,
                                navigation,
                            })
                        }
                    >
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
    // input: {},
    // buttonContainer: {
    //     width: '100%',
    //     justifyContent: 'space-evenly',
    //     flexDirection: 'row',
    // },
    // button: {
    //     width: 100,
    // },
});

export default LoginScreen;
