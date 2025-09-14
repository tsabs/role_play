import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Portal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import SafeView from '@components/library/SafeView';
import { CharactersList } from '@components/character/dnd5e/CharactersList';
import { useAuth } from '@navigation/hook/useAuth';
import { RootStackParamList } from '@navigation/RootNavigation';
import { selectAllCharacters } from '@store/character/selectors';
import { useAppDispatch, useAppSelector } from '@store/index';
import { selectSessions } from '@store/session/selectors';
import { inviteCharacterToSession } from '@store/session/sessionServices';
import { ModalAddCharacter } from '@views/sessions/ModalAddCharacter';

import { theme } from '../../../style/theme.ts';

type SessionCharactersProps = NativeStackScreenProps<
    RootStackParamList,
    'SessionCharacters'
>;

export const SessionCharactersScreen = ({ route }: SessionCharactersProps) => {
    const { sessionId, gmId } = route.params || {};
    const dispatch = useAppDispatch();
    const auth = useAuth();
    const { t } = useTranslation();
    const allCharacters = useAppSelector(selectAllCharacters);
    const sessions = useAppSelector(selectSessions);
    const [shouldShowModal, setShouldShowModal] = React.useState(false);
    // find session
    const session = sessions?.find((s) => s.id === sessionId);

    // filter characters by session.playerCharacterIds
    const sessionCharacters = allCharacters.filter(
        (char) => session?.playerCharacterIds?.includes(char.id)
    );

    const handleShowModal = useCallback(() => {
        setShouldShowModal(!shouldShowModal);
    }, [shouldShowModal]);

    const handleInviteCharacter = useCallback(
        async (characterId: string) => {
            await inviteCharacterToSession(
                sessionId,
                characterId,
                gmId,
                dispatch
            );
        },
        [dispatch, gmId, sessionId]
    );

    return (
        <SafeView title={t('characters.title')}>
            {/*<Modal*/}
            <Portal>
                <ModalAddCharacter
                    shouldShowModal={shouldShowModal}
                    setShouldShowModal={setShouldShowModal}
                    handleAddCharacter={handleInviteCharacter}
                />
            </Portal>
            <Button
                style={styles.button}
                textColor={theme.colors.white}
                buttonColor={theme.colors.primary}
                onPress={handleShowModal}
            >
                {'Ajouter un personnage'}
            </Button>
            <CharactersList
                characters={sessionCharacters}
                mode={'session'}
                sessionId={sessionId}
                gmId={gmId}
            />
        </SafeView>
    );
};

const styles = StyleSheet.create({
    button: {
        marginHorizontal: theme.space.l,
    },
    title: {
        alignItems: 'center',
    },
});
