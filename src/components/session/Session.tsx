import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Card } from 'react-native-paper';

import CustomText from '@components/atom/CustomText';
import CustomDialog from '@components/library/CustomDialog';
import { useAuth } from '@navigation/hook/useAuth';
import { Session } from '@store/session/types';

import { theme } from '../../../style/theme';
import { DAND_INTRO } from '../../../assets';

const SessionCard = ({
    session,
    removeSession,
}: {
    session: Session;
    removeSession: () => void;
}) => {
    const { t } = useTranslation();
    const auth = useAuth();
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);

    const handleDisplayDialog = useCallback(() => {
        setIsVisible(true);
    }, []);

    const handleNavigation = useCallback(() => {
        console.log('naviagate');
        if (auth.user.uid !== session.gmId) {
            navigation.navigate('SessionCharacters', {
                sessionId: session.id,
                gmId: session.gmId,
            });
        } else {
            navigation.navigate('BottomSessionTabs', {
                // screen: 'SessionCharacters',
                // params: {
                sessionId: session.id,
                gmId: session.gmId,
                // },
            });
        }
    }, [auth.user.uid, navigation, session.gmId, session.id]);

    return (
        <Card
            style={{
                marginTop: theme.space.xl,
                // backgroundColor: theme.colors.light50,
            }}
            onPress={handleNavigation}
            onLongPress={handleDisplayDialog}
        >
            <CustomDialog
                title={t('character.removeCharacter', {
                    name: session.name,
                })}
                description={t('character.removeCharacterDescription')}
                isVisible={isVisible}
                triggerAction={removeSession}
                setIsVisible={setIsVisible}
            />
            <Card.Cover
                style={{ backgroundColor: theme.colors.light25 }}
                source={session?.gameImgPath || DAND_INTRO}
            />
            <Card.Title
                title={session.name}
                subtitle={`Jeu de rôle: ${session.gameType}`}
            />
            <Card.Content>
                {session?.gameMasterName && (
                    <CustomText text={session?.gameMasterName} />
                )}
                <CustomText
                    text={`nb joueurs: ${session.playerCharacterIds?.length}`}
                />
            </Card.Content>
        </Card>
    );
};

export { SessionCard };
