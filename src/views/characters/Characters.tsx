import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Portal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import SafeView from '@components/library/SafeView';
import CharacterItem from '@components/character/CharacterItem';
import Separator from '@components/library/Separator';
import CustomText from '@components/atom/CustomText';
import { useAuth } from '@navigation/hook/useAuth';
import { useAppDispatch, useAppSelector } from '@store/index';
import { selectAllCharacters } from '@store/character/selectors';
import { loadCharacters } from '@store/character/slice';
import ModalSelectGame from '@views/characters/ModalSelectGame';

import { theme } from '../../../style/theme';

const margin = 10;

const CharactersScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const auth = useAuth();
    const callCharacters = useCallback(async () => {
        await loadCharacters(auth.user.email, dispatch);
    }, [auth.user.email, dispatch]);
    const characters = useAppSelector(selectAllCharacters);
    const [mounted, setMounted] = useState(false);
    const [shouldShowModal, setShouldShowModal] = useState(false);

    const handleShowModal = useCallback(() => {
        setShouldShowModal(!shouldShowModal);
    }, [shouldShowModal]);

    const handleNavigation = useCallback(() => {
        navigation.navigate('CharacterFormProvider', {
            gameType: 'dnd5e',
        });
    }, [navigation]);

    // This seems to fix an Android bug where the bottom bar is hidden after mount
    useEffect(() => {
        const timeout = setTimeout(() => setMounted(true), 75);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        callCharacters();
    }, [callCharacters]);

    if (!mounted) return null;

    return (
        <SafeView>
            <Portal>
                <ModalSelectGame
                    shouldShowModal={shouldShowModal}
                    setShouldShowModal={setShouldShowModal}
                    handleNavigation={handleNavigation}
                />
            </Portal>
            <View style={styles.title}>
                <CustomText
                    fontSize={theme.fontSize.extraLarge}
                    text={t('characters.title')}
                />
            </View>
            <Button
                style={styles.button}
                textColor={theme.colors.white}
                buttonColor={theme.colors.primary}
                onPress={handleShowModal}
            >
                {t('characters.titleButtonText')}
            </Button>
            <FlatList
                data={characters}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                horizontal
                ItemSeparatorComponent={({ leadingItem }) => (
                    <Separator
                        key={leadingItem.id}
                        horizontal
                        spacer={{ size: theme.space.md }}
                    />
                )}
                renderItem={({ item, index }) => (
                    <CharacterItem
                        key={item.id}
                        character={item}
                        index={index}
                    />
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
        alignItems: 'center',
    },
});

export default CharactersScreen;
