import { Fragment, useCallback, useMemo, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { List } from 'react-native-paper';

import SafeView from '../../components/library/SafeView';
import { DND_CHARACTER_DEFAULT } from '../../../assets';
import Animated, { FadeIn } from 'react-native-reanimated';
import { theme } from '../../../style/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import CustomText from '../../components/atom/CustomText';
import { Character, GAME_TYPE } from '../../types/generic';
import AbilityForm from '../../components/character/form/generic/AbilityForm';
import { DnDAbility } from '../../types/games/d2d5e';
import { WarHammerAbility } from '../../types/games/warHammer';

interface CharacterOverviewProps {
    character: Character;
}

const { height, width } = Dimensions.get('screen');

const CharacterOverview = ({ character }: CharacterOverviewProps) => {
    const { t } = useTranslation();
    const tabBarHeight = useBottomTabBarHeight();
    const [currentForm, setCurrentForm] = useState<string | undefined>(
        undefined
    );
    const [isEditMode, setIsEditMode] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleEditMode = useCallback(() => {
        setIsEditMode((previousState) => {
            return !previousState;
        });
    }, []);

    const displayAbilityForm = useCallback(() => {
        switch (character.gameType) {
            default:
            case GAME_TYPE.DND5E:
                return (
                    <AbilityForm<DnDAbility>
                        abilities={
                            character?.abilities as Record<DnDAbility, number>
                        }
                        onChange={() => {}}
                        isEditModeEnabled={true}
                        onEditMode={handleEditMode}
                        isEditMode={isEditMode}
                    />
                );
            case GAME_TYPE.WAR_HAMMER:
                return (
                    <AbilityForm<WarHammerAbility>
                        abilities={
                            character?.abilities as Record<
                                WarHammerAbility,
                                number
                            >
                        }
                        onChange={() => {}}
                        isEditModeEnabled={true}
                        isEditMode={isEditMode}
                    />
                );
        }
    }, [character?.abilities, isEditMode, handleEditMode]);

    const accordions = useMemo(
        () => [
            {
                id: 1,
                title: 'character.overview.accordion.charcacterInformations',
                content: (
                    <Fragment>
                        <View>
                            <CustomText text={character.description} />
                        </View>
                        <View>
                            <CustomText text={character.additionalBackground} />
                        </View>
                    </Fragment>
                ),
            },
            {
                id: 2,
                title: 'character.overview.accordion.equipments',
                content: <CustomText text="Will come soon" />,
            },
            {
                id: 3,
                title: 'character.overview.accordion.characteristics',
                content: displayAbilityForm(),
            },
            {
                id: 4,
                title: 'character.overview.accordion.skills',
                content: <CustomText text="Will come soon" />,
            },
            {
                id: 5,
                title: 'character.overview.accordion.spells',
                content: <CustomText text="Will come soon" />,
            },
        ],
        [
            character.description,
            character.additionalBackground,
            displayAbilityForm,
        ]
    );

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
                                expanded={expandedId === accordion.id}
                                style={styles.accordionContainer}
                                onPress={() => {
                                    setExpandedId(
                                        expandedId === accordion.id
                                            ? null
                                            : accordion.id
                                    );
                                    setCurrentForm(accordion.id.toString());
                                }}
                                // right={(props) => {
                                //     console.log(props);
                                //     return <CustomButton text={'Press me'} />;
                                // }}
                                title={<CustomText text={t(accordion.title)} />}
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
