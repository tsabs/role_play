import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, Text, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import SafeView from '../../components/library/SafeView';
import { theme } from '../../../style/theme';

const characters = [
    { id: '1', name: 'Mario' },
    { id: '2', name: 'Luigi' },
    { id: '3', name: 'Zelda' },
];

const margin = 10;

const CharactersScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeView>
            <View style={styles.title}>
                {characters.length > 0 && <Title>Liste des personnages</Title>}
            </View>
            <Button
                style={styles.button}
                textColor={theme.colors.white}
                buttonColor={theme.colors.primary}
                onPress={() =>
                    navigation.navigate('CharacterFormProvider', {
                        gameType: 'dnd5e',
                    })
                }
            >
                Créer un personnage
            </Button>
            <FlatList
                data={characters}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => {
                            console.log('test');
                            // navigation.navigate('Character', {
                            //     character: item,
                            // })
                        }}
                    >
                        <Animated.View
                            entering={FadeInRight.delay(index * 200)}
                        >
                            <Card style={styles.card}>
                                <Text>{item.name}</Text>
                            </Card>
                        </Animated.View>
                    </TouchableOpacity>
                )}
            />
        </SafeView>
    );
};

const styles = StyleSheet.create({
    button: {
        marginHorizontal: margin,
    },
    card: {
        margin,
        padding: 15,
    },
    title: {
        marginTop: theme.space.xxxl,
        alignItems: 'center',
    },
});

export default CharactersScreen;
