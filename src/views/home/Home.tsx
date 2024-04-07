import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

import { FIREBASE_AUTH } from '../../../firebaseConfig';
import { Button } from '@rneui/base';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}
const Home = ({ navigation }: RouterProps) => {
    return (
        <View style={styles.container}>
            <Button onPress={() => navigation.navigate('OTHER SCREEN')} title="Open OTHER SCREEN" />
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
            <Text>This is Home</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Home;
