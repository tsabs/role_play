import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import SafeView from '../../components/library/SafeView';

const characters = [
    { id: '1', name: 'Mario' },
    { id: '2', name: 'Luigi' },
    { id: '3', name: 'Zelda' },
];

const CharactersScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeView>
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
                            entering={FadeInRight.delay(index * 100)}
                        >
                            <Card style={{ margin: 10, padding: 15 }}>
                                <Text>{item.name}</Text>
                            </Card>
                        </Animated.View>
                    </TouchableOpacity>
                )}
            />
        </SafeView>
    );
};

export default CharactersScreen;
