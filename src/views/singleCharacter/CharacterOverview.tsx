import {
    Dimensions,
    ImageBackground,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { List, Text } from 'react-native-paper';

import SafeView from '../../components/library/SafeView';
import { GenericCharacter } from '../../store/character/slice';
import { DND_CHARACTER_DEFAULT } from '../../../assets';
import Animated, { FadeIn } from 'react-native-reanimated';
import { theme } from '../../../style/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

interface CharacterOverviewProps {
    character: GenericCharacter;
}

const { height, width } = Dimensions.get('screen');

const CharacterOverview = ({ character }: CharacterOverviewProps) => {
    const { t } = useTranslation();
    const tabBarHeight = useBottomTabBarHeight();

    return (
        <SafeView parentStyles={{ flex: 1, padding: 0 }} title={character.name}>
            <ScrollView
                scrollEnabled={true}
                contentContainerStyle={{ paddingBottom: tabBarHeight }}
            >
                <Animated.View entering={FadeIn.duration(750).delay(100)}>
                    <ImageBackground
                        source={DND_CHARACTER_DEFAULT}
                        style={styles.imageBackground}
                    />
                </Animated.View>
                <List.AccordionGroup>
                    <List.Accordion
                        style={styles.accordionContainer}
                        title={t(
                            'character.overview.accordion.charcacterInformations'
                        )}
                        id={1}
                    >
                        <View style={styles.accordionContent}>
                            <View>
                                <Text>{character.description}</Text>
                            </View>
                            <View>
                                <Text>{character.additionalBackground}</Text>
                            </View>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        style={styles.accordionContainer}
                        title={t('character.overview.accordion.equipments')}
                        id={2}
                    >
                        <View style={styles.accordionContent}>
                            <Text>Will come soon</Text>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        style={styles.accordionContainer}
                        title={t(
                            'character.overview.accordion.characteristics'
                        )}
                        id={3}
                    >
                        <View style={styles.accordionContent}>
                            <Text>Will come soon</Text>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        style={styles.accordionContainer}
                        title={t('character.overview.accordion.skills')}
                        id={4}
                    >
                        <View style={styles.accordionContent}>
                            <Text>Will come soon</Text>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        style={styles.accordionContainer}
                        title={t('character.overview.accordion.spells')}
                        id={5}
                    >
                        <View style={styles.accordionContent}>
                            <Text>Will come soon</Text>
                        </View>
                    </List.Accordion>
                </List.AccordionGroup>
            </ScrollView>
        </SafeView>
    );
};

const styles = StyleSheet.create({
    imageBackground: {
        width,
        height: height / 2,
    },
    accordionContainer: {
        backgroundColor: theme.colors.light,
    },
    accordionContent: {
        padding: theme.space.md,
    },
});

export default CharacterOverview;
