import React, { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import SafeView from '../../components/library/SafeView';
import { theme } from '../../../style/theme';
import { loadCharacters } from '../../store/character/slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { useAuth } from '../../navigation/hook/useAuth';
import { selectAllCharacters } from '../../store/character/selectors';
import CharacterItem from '../../components/character/CharacterItem';
import Separator from '../../components/library/Separator';

const margin = 10;

const CharactersScreen = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const auth = useAuth();
    const callCharacters = useCallback(async () => {
        await loadCharacters(auth.user.email, dispatch);
    }, []);
    const characters = useAppSelector(selectAllCharacters);

    useEffect(() => {
        callCharacters();
    }, [callCharacters]);

    return (
        <SafeView>
            <View style={styles.title}>
                <Title>Liste des personnages</Title>
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
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                horizontal
                // contentContainerStyle={{ alignItems: 'center' }}
                ItemSeparatorComponent={() => (
                    <Separator horizontal spacer={{ size: theme.space.md }} />
                )}
                renderItem={({ item, index }) => (
                    <CharacterItem character={item} index={index} />
                )}
            />
        </SafeView>
    );
};

const styles = StyleSheet.create({
    button: {
        marginHorizontal: margin,
    },
    title: {
        marginTop: theme.space.xxxl,
        alignItems: 'center',
    },
});

export default CharactersScreen;
