import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button } from '@rneui/base';
import { Input } from '@rneui/themed';

import { FIREBASE_AUTH } from '../../../firebaseConfig';
import { signIn } from '../../firebase/auth';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const auth = FIREBASE_AUTH;

    return (
        <View style={styles.container}>
            <Input
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
            ></Input>
            <Input
                style={styles.input}
                placeholder="password"
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
            ></Input>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.buttonContainer}>
                    <Button
                        style={styles.button}
                        title="Login"
                        onPress={() =>
                            signIn({
                                auth,
                                email,
                                password,
                                setLoading,
                            })
                        }
                    />
                    <Button
                        style={styles.button}
                        title="Sign In"
                        onPress={() =>
                            signIn({
                                auth,
                                email,
                                password,
                                setLoading,
                            })
                        }
                    />
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
    button: {
        width: 100,
    },
});

export default Login;
