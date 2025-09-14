import { useCallback, useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button, Portal, Text } from 'react-native-paper';
import { getAuth } from '@react-native-firebase/auth';

import { SessionCard } from '@components/session/Session';
import SafeView from '@components/library/SafeView';
import CustomText from '@components/atom/CustomText';
import { useAppDispatch, useAppSelector } from '@store/index';
import { selectSessions } from '@store/session/selectors';
import {
    createSession,
    getSessionsForUser,
    removeSession,
} from '@store/session/sessionServices';
import { ModalCreateGame } from '@views/sessions/ModalCreateGame';

import { theme } from '../../../style/theme';

const Sessions = () => {
    const dispatch = useAppDispatch();
    const auth = getAuth().currentUser;
    const fetchSessions = useCallback(async () => {
        await getSessionsForUser(auth.uid, dispatch);
    }, [dispatch, auth.uid]);
    const [shouldShowModal, setShouldShowModal] = useState(false);

    const handleShowModal = useCallback(() => {
        setShouldShowModal(!shouldShowModal);
    }, [shouldShowModal]);
    const sessions = useAppSelector(selectSessions);

    const callCreateGame = useCallback(
        async (gameType: string, gameName: string, gameImgPath?: string) => {
            await createSession(
                auth.uid,
                gameName,
                dispatch,
                gameImgPath,
                gameType
            );
        },
        [auth.uid, dispatch]
    );

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    return (
        <SafeView>
            <Portal>
                <ModalCreateGame
                    shouldShowModal={shouldShowModal}
                    setShouldShowModal={setShouldShowModal}
                    handleCreateGame={callCreateGame}
                />
            </Portal>
            <View style={styles.header}>
                <View style={styles.title}>
                    {sessions?.length > 0 && (
                        <CustomText
                            fontSize={theme.fontSize.large}
                            text="Liste des campagnes en cours"
                        />
                    )}
                </View>
                <Button
                    buttonColor={theme.colors.primary}
                    onPress={handleShowModal}
                >
                    <Text style={styles.buttonText}>
                        Créer une nouvelle partie
                    </Text>
                </Button>
            </View>
            <Animated.FlatList
                data={sessions}
                ListFooterComponent={() => <View style={{ height: 100 }} />}
                renderItem={({ item }) => (
                    <SessionCard
                        session={item}
                        removeSession={() => removeSession(item.id, dispatch)}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeView>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: theme.space.md,
    },
    buttonText: {
        color: theme.colors.white,
    },
    title: {
        alignItems: 'center',
    },
});

export default Sessions;
