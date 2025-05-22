import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';

import SafeView from '../../../components/library/SafeView';
import { DND_CHARACTER_DEFAULT } from '../../../../assets';
import Animated, { FadeIn } from 'react-native-reanimated';
import { theme } from '../../../../style/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import CustomText from '../../../components/atom/CustomText';
import { Ability, Character, GAME_TYPE } from '../../../types/generic';
import AbilityForm from '../../../components/character/form/generic/AbilityForm';
import { DnDAbility, DnDCharacter } from '../../../types/games/d2d5e';
import { WarHammerAbility } from '../../../types/games/warHammer';
import {
    callUpdateCharacter,
    loadClassData,
    loadSpecificTalentClassPerLevel,
} from '../../../store/character/slice';
import { ABILITIES } from '../../../components/character/form/dnd5e/constants';
import { useAppDispatch } from '../../../store';
import CharacterTalentClassFormProvider from '../../../components/character/CharacterTalentClassFormProvider';
import CustomSelectionButton from '../../../components/atom/CustomSelectionButton';
import { maxLevels } from '../../../utils/d2d5';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../utils/utils';
import TalentClassForm from '../../../components/character/form/dnd5e/TalentClassForm';

interface CharacterOverviewDndProps {
    character: DnDCharacter;
}

interface OnSaveAbilities<T extends Ability> {
    [key: string]: Record<T, number>;
}

const CharacterOverviewDnd = ({ character }: CharacterOverviewDndProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const tabBarHeight = useBottomTabBarHeight();
    const [currentForm, setCurrentForm] = useState<string | undefined>(
        undefined
    );
    const [classData, setClassData] = useState(undefined);

    console.log(character);
    const [isEditMode, setIsEditMode] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [level, setLevel] = useState(character.level);
    const [selectedAbilities, setSelectedAbilities] = useState<
        Record<Ability, number> | undefined
    >(undefined);

    const handleEditMode = useCallback(() => {
        setIsEditMode((previousState) => {
            return !previousState;
        });
    }, []);

    const handleUpdateCharacter = useCallback(
        (updated: Record<Ability, number>) => {
            setSelectedAbilities(updated);
        },
        []
    );

    const handleSaveEdit = useCallback(
        async (abilities: OnSaveAbilities<Ability>) => {
            const updatedCharacter = { ...character, ...abilities };
            await callUpdateCharacter(updatedCharacter, dispatch);
        },
        []
    );

    const handleClassData = useCallback(async () => {
        await loadClassData(character.gameType, character.className.index)
            .then((res) => {
                setClassData(res);
                console.log('class data : ', res);
            })
            .catch((err) => console.log('error getting class data', err));
    }, [character.gameType, character.className]);

    const handleClassSpecificTalent = useCallback(async () => {
        await loadSpecificTalentClassPerLevel(
            character.gameType,
            character.className?.index
                ? character.className?.index
                : (character.className as any),
            character.level.toString()
        )
            .then((res) => {
                console.log('talent result : ', res);
            })
            .catch((err) =>
                console.log('error getting level specific class talent', err)
            );
    }, []);

    useEffect(() => {
        Promise.all([handleClassSpecificTalent(), handleClassData()]);
    }, [handleClassSpecificTalent, handleClassData]);

    useEffect(() => {
        if (selectedAbilities === undefined) {
            setSelectedAbilities(
                character?.abilities as Record<Ability, number>
            );
        }
    }, [character?.abilities]);

    const displayAbilityForm = useCallback(() => {
        return (
            <AbilityForm<DnDAbility>
                abilities={
                    (selectedAbilities as Record<DnDAbility, number>) ||
                    ABILITIES
                }
                onChange={handleUpdateCharacter}
                onSaveEdit={handleSaveEdit}
                isEditModeEnabled={true}
                onEditMode={handleEditMode}
                isEditMode={isEditMode}
            />
        );
    }, [isEditMode, selectedAbilities, handleEditMode, handleUpdateCharacter]);

    const handleSelectLevel = useCallback(async (value: string | number) => {
        const newLevel = Number(value);
        setLevel(newLevel);
        const updatedCharacter = { ...character, level: newLevel };
        await callUpdateCharacter(updatedCharacter, dispatch);
    }, []);

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
                title: `character.classes.${character.className.index}.name`,
                content: (
                    <TalentClassForm
                        abilities={selectedAbilities}
                        level={level}
                        characterClass={character.className.index}
                    />
                ),
            },
            {
                id: 3,
                title: 'character.overview.accordion.equipments',
                content: <CustomText text="Will come soon" />,
            },
            {
                id: 4,
                title: 'character.overview.accordion.characteristics',
                content: displayAbilityForm(),
            },
            {
                id: 5,
                title: 'character.overview.accordion.skills',
                content: <CustomText text="Will come soon" />,
            },
            {
                id: 6,
                title: 'character.overview.accordion.spells',
                content: <CustomText text="Will come soon" />,
            },
        ],
        [
            character.description,
            character.additionalBackground,
            level,
            selectedAbilities,
            displayAbilityForm,
        ]
    );

    const totalHp = useMemo(
        () =>
            classData?.hit_die && level
                ? level === 1
                    ? classData.hit_die
                    : classData.hit_die +
                      Math.ceil((classData.hit_die * (level - 1)) / 2) +
                      level -
                      1
                : 1,
        [level, classData?.hit_die]
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
                    >
                        <View style={styles.levelBadge}>
                            <CustomSelectionButton
                                items={maxLevels}
                                customStyle={{
                                    flexDirection: 'row',
                                }}
                                preSelectedValue={{
                                    label: level.toString(),
                                    value: level,
                                }}
                                displayValue={`LVL: ${level}`}
                                onSelect={handleSelectLevel}
                            />
                        </View>
                        <View style={styles.lifePointsBadge}>
                            <CustomText
                                fontSize={16}
                                fontWeight={'bold'}
                                color={theme.colors.white}
                                text={`${totalHp} PV`}
                            />
                        </View>
                    </ImageBackground>
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
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 2,
    },
    accordionContainer: {
        backgroundColor: theme.colors.light,
    },
    accordionContent: {
        padding: theme.space.md,
    },
    levelBadge: {
        position: 'absolute',
        left: theme.space.md,
        top: theme.space.md,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingHorizontal: theme.space.md,
        paddingVertical: theme.space.sm,
        borderRadius: theme.radius.md,
    },
    lifePointsBadge: {
        position: 'absolute',
        top: theme.space.md,
        right: theme.space.md,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: theme.space.md,
        paddingVertical: theme.space.sm,
        borderRadius: theme.radius.md,
    },
});

export default CharacterOverviewDnd;
