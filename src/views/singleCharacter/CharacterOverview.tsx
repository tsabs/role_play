import { Fragment } from 'react';
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

    const accordions = [
        {
            id: 1,
            title: 'character.overview.accordion.charcacterInformations',
            content: (
                <Fragment>
                    <View>
                        <Text>{character.description}</Text>
                    </View>
                    <View>
                        <Text>{character.additionalBackground}</Text>
                    </View>
                </Fragment>
            ),
        },
        {
            id: 2,
            title: 'character.overview.accordion.equipments',
            content: <Text>Will come soon</Text>,
        },
        {
            id: 3,
            title: 'character.overview.accordion.characteristics',
            content: <Text>Will come soon</Text>,
        },
        {
            id: 4,
            title: 'character.overview.accordion.skills',
            content: <Text>Will come soon</Text>,
        },
        {
            id: 5,
            title: 'character.overview.accordion.spells',
            content: <Text>Will come soon</Text>,
        },
    ];

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
                    {accordions.map((accordion) => {
                        return (
                            <List.Accordion
                                key={accordion.id}
                                style={styles.accordionContainer}
                                title={t(accordion.title)}
                                id={accordion.id}
                            >
                                <Animated.View
                                    style={styles.accordionContent}
                                    entering={FadeIn.duration(500).delay(50)}
                                >
                                    {accordion.content}
                                </Animated.View>
                            </List.Accordion>
                        );
                    })}
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
