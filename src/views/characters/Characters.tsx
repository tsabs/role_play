import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Portal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import CustomText from '@components/atom/CustomText';
import SafeView from '@components/library/SafeView';
import { CharactersList } from '@components/character/dnd5e/CharactersList';
import { useAuth } from '@navigation/hook/useAuth';
import { RootStackParamList } from '@navigation/RootNavigation';
import { useAppDispatch, useAppSelector } from '@store/index';
import { selectAllCharacters } from '@store/character/selectors';
import { loadCharacters } from '@store/character/slice';
import ModalSelectGame from '@views/characters/ModalSelectGame';

import { theme } from '../../../style/theme';

const margin = 10;

type CharactersProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const CharactersScreen = ({ route }: CharactersProps) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const auth = useAuth();
    const callCharacters = useCallback(async () => {
        await loadCharacters(dispatch);
    }, [dispatch]);
    const allCharacters = useAppSelector(selectAllCharacters);
    const characters = allCharacters.filter(
        (character) => character.ownerId === auth.user.uid
    );
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
            <CharactersList characters={characters} />
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
