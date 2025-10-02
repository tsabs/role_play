import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Divider, IconButton, Portal } from 'react-native-paper';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ability, Character } from 'types/generic';
import { DnDAbility, DnDCharacter } from 'types/games/d2d5e';

import CustomButton from '@components/atom/CustomButton';
import CustomText from '@components/atom/CustomText';
import CustomSelectionButton from '@components/atom/CustomSelectionButton';
import AbilityForm from '@components/character/form/generic/AbilityForm';
import TalentClassForm from '@components/character/form/dnd5e/TalentClassForm';
import SkillsList from '@components/character/form/dnd5e/SkillsList';
import VirtualizedScrollView from '@components/library/VirtualizedScrollView';
import EquipmentList from '@components/character/form/dnd5e/EquipmentList';
import SpellList from '@components/character/form/dnd5e/SpellList.tsx';
import SafeView from '@components/library/SafeView';
import {
    callUpdateCharacter,
    loadClassData,
    loadSpecificTalentClassPerLevel,
} from '@store/character/slice';
import { useAppDispatch } from '@store/index';
import {
    calculateModifier,
    extractCharacterProficiencies,
    maxLevels,
    mergeAbilityBonuses,
    remainingPoints,
    transformRaceAbilities,
} from '@utils/d2d5';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@utils/utils';

import { DND_CHARACTER_DEFAULT } from '../../../../assets';
import { theme } from '../../../../style/theme';

import ModalCharacterSettings from './ModalCharacterSettings';

interface CharacterOverviewDndProps {
    character: DnDCharacter;
}

interface OnSaveAbilities<T extends Ability> {
    [key: string]: Record<T, number>;
}

const CharacterOverviewDnd = ({ character }: CharacterOverviewDndProps) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const tabBarHeight = useBottomTabBarHeight();
    const [classData, setClassData] = useState(undefined);
    const [level, setLevel] = useState(character.level);
    const [selectedClassElements, setSelectedClassElements] = useState<{
        selected_subclass?: string;
        classChoices?: Record<string, Array<{ index: string; bonus?: number }>>;
    }>(character.selectedClassElements);
    const [shouldShowModal, setShouldShowModal] = useState(false);
    const [characterImgUri, setCharacterImgUri] = useState(character?.imageUri);

    const handleShowModal = useCallback(() => {
        setShouldShowModal(!shouldShowModal);
    }, [shouldShowModal]);

    const handleSaveEdit = useCallback(
        async (abilities: OnSaveAbilities<Ability>) => {
            const updatedCharacter = { ...character, ...abilities };
            await dispatch(callUpdateCharacter(updatedCharacter));
        },
        [character, dispatch]
    );

    const handleClassData = useCallback(async () => {
        await loadClassData(character.gameType, character.className.index)
            .then((res) => {
                setClassData(res);
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
    }, [character?.className, character?.gameType, character?.level]);

    // const callAPID = useCallback(async () => {
    //     await fetch(`https://api.open5e.com/armor?limit=200`)
    //         .then((res) => {
    //             const data = res.json();
    //             console.log(data);
    //         })
    //         .catch((err) => console.log(err));
    // }, []);
    //
    // useEffect(() => {
    //     callAPID();
    // }, [callAPID]);

    useEffect(() => {
        Promise.all([handleClassSpecificTalent(), handleClassData()]);
    }, [handleClassSpecificTalent, handleClassData]);

    const handleUpdateCharacterInFirestore = useCallback(
        async ({
            imgUri,
            elements,
            lvl,
        }: {
            imgUri: string;
            elements: {
                selected_subclass?: string;
                classChoices?: Record<
                    string,
                    Array<{ index: string; bonus?: number }>
                >;
            };
            lvl: number;
        }) => {
            const updatedCharacter: Character = {
                ...character,
                level: lvl,
                selectedClassElements: elements,
                imageUri: imgUri ?? '',
            };
            await dispatch(callUpdateCharacter(updatedCharacter));
        },
        [character, dispatch]
    );

    const handleCharacterImgChange = useCallback(
        async (uri: string) => {
            setCharacterImgUri(uri);
            await handleUpdateCharacterInFirestore({
                imgUri: uri,
                elements: selectedClassElements,
                lvl: level,
            });
        },
        [handleUpdateCharacterInFirestore, level, selectedClassElements]
    );

    const handleSelectLevel = useCallback(
        async (value: string | number) => {
            const newLevel = Number(value);
            setLevel(newLevel);
            await handleUpdateCharacterInFirestore({
                imgUri: characterImgUri ?? '',
                elements: selectedClassElements,
                lvl: newLevel,
            });
        },
        [
            characterImgUri,
            handleUpdateCharacterInFirestore,
            selectedClassElements,
        ]
    );

    const handleSubclassChange = useCallback(
        async (
            selected: string,
            seClassChoices: Record<
                string,
                Array<{ index: string; bonus?: number }>
            >
        ) => {
            setSelectedClassElements({
                selected_subclass: selected,
                classChoices: seClassChoices,
            });
            await handleUpdateCharacterInFirestore({
                elements: {
                    selected_subclass: selected,
                    classChoices: seClassChoices,
                },
                imgUri: characterImgUri ?? '',
                lvl: level,
            });
        },
        [characterImgUri, handleUpdateCharacterInFirestore, level]
    );

    const transformedAbilities = useMemo(
        () => transformRaceAbilities(character?.race?.ability_bonuses),
        [character?.race?.ability_bonuses]
    );

    const mergeAbilities = useMemo(
        () =>
            mergeAbilityBonuses(
                character?.selectedRaceElements?.raceChoices?.[
                    `${character?.race?.index}-skills`
                ] || [],
                transformedAbilities
            ),
        [
            character?.race?.index,
            character?.selectedRaceElements?.raceChoices,
            transformedAbilities,
        ]
    );

    const handleAccordionPress = useCallback(
        (id: number, content: any, title: string) => {
            navigation.navigate('ProtectedScreen', {
                screen: 'AccordionModal',
                params: {
                    accordionId: id,
                    characterId: character.id,
                    content,
                    title,
                },
            });
        },
        [character.id, navigation]
    );

    const getAbilitiesFinalScore = useCallback(() => {
        const result = { ...character.abilities };
        mergeAbilities.forEach(({ index, bonus }) => {
            const key = index.toUpperCase();
            if (result && result?.[key] !== undefined) {
                result[key] += bonus;
            }
        });
        return result;
    }, [character.abilities, mergeAbilities]);

    const accordions = useMemo(() => {
        const proficienciesExtracted = extractCharacterProficiencies({
            ...character,
            selectedClassElements,
        });

        return [
            {
                id: 1,
                title: 'character.overview.accordion.charcacterInformations',
                content: (
                    <Fragment>
                        <View>
                            <CustomText
                                fontWeight="bold"
                                text={t(
                                    'character.overview.accordion.label.charInformation'
                                )}
                            />
                            <CustomText text={character.description} />
                        </View>
                        <Divider style={{ marginVertical: theme.space.md }} />
                        <View>
                            <CustomText
                                fontWeight="bold"
                                text={t(
                                    'character.overview.accordion.label.additionalBackground'
                                )}
                            />
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
                        abilities={getAbilitiesFinalScore()}
                        level={level}
                        characterClass={character.className.index}
                        isEditModeEnabled
                        selectedRaceElements={character?.selectedRaceElements}
                        selectedClassElements={selectedClassElements}
                        onSubclassSelect={handleSubclassChange}
                        proficienciesExtracted={proficienciesExtracted}
                    />
                ),
            },
            {
                id: 3,
                title: 'character.overview.accordion.equipments',
                content: <EquipmentList character={character} />,
            },
            {
                id: 4,
                title: 'character.overview.accordion.characteristics',
                content: (
                    <AbilityForm<DnDAbility>
                        characterId={character.id}
                        onSaveEdit={handleSaveEdit}
                        isEditModeEnabled
                        abilityBonuses={mergeAbilities}
                        remainingPoints={remainingPoints}
                    />
                ),
            },
            {
                id: 5,
                title: 'character.overview.accordion.skills',
                content: (
                    <SkillsList
                        character={character}
                        level={level}
                        proficiencies={proficienciesExtracted}
                    />
                ),
            },
            {
                id: 6,
                title: 'character.overview.accordion.spells',
                content: <SpellList characterId={character.id} />,
            },
        ];
    }, [
        character,
        level,
        handleSaveEdit,
        selectedClassElements,
        handleSubclassChange,
        mergeAbilities,
        getAbilitiesFinalScore,
        t,
    ]);

    const totalHp = useMemo(
        () =>
            classData?.hit_die && level
                ? level === 1
                    ? classData.hit_die +
                      calculateModifier(character?.abilities?.CON)
                    : classData.hit_die +
                      (Math.ceil((classData.hit_die * (level - 1)) / 2) +
                          level -
                          1) +
                      calculateModifier(character?.abilities?.CON) * level
                : 1,
        [classData?.hit_die, level, character?.abilities?.CON]
    );

    const makeCharacterImgPrompt = useMemo(() => {
        // const gameTypeTrad = t(`games.${character.gameType}.name`);
        const raceTrad = t(`character.races.${character.race.index}.name`);
        const classTrad = t(
            `character.classes.${character.className.index}.name`
        );
        const backgroundTrad = t(
            `character.backgrounds.${character.background.index}.name`
        );
        // const subClass = selectedClassElements?.selected_subclass
        //     ? `et sous classe ${t(
        //           `character.classes.${character.className.index}.subclasses.${selectedClassElements.selected_subclass}.title`
        //       )}`
        //     : '';
        const style = 'en style semi-réaliste inspiré de donjons et dragons.';

        // const shouldNotDisplay =
        //     "Important, ne pas afficher de texte, de description, de bordure ou de mise en page graphique. L’image doit être une scène illustrée, ce n'est en aucun cas un document.";

        return (
            `Image vertical de qualité professionnelle, ${style}\n` +
            // 'Le genre et apparence du personnage dépendent de sa description.\n' +
            `Le personnage est un ${raceTrad}, de classe ${classTrad}.` +
            `Issu(e) d’un passé de type ${backgroundTrad}\n` + // dans l’univers ${gameTypeTrad}.\n` +
            `Description : ${character.description}\n`
            // `Histoire : ${character.additionalBackground}\n` +
            // `Le personnage est représenté en pied (corps entier), dans un environnement détaillé lié à son histoire : montagne, cité médiévale, forêt enchantée, temple en ruine, bord de mer etc.` +
            // `Aucun texte, aucune bordure, aucune interface ou fiche détaillé, juste l’illustration du personnage dans son environnement. Il ou elle peut etre réprésenté en pleine action ou en pause, mais sans texte ni éléments graphiques.`
        );
    }, [
        // character.additionalBackground,
        character.background.index,
        character.className.index,
        character.description,
        // character.gameType,
        character.race.index,
        // selectedClassElements.selected_subclass,
        t,
    ]);

    return (
        <SafeView
            parentStyles={{ flex: 1, padding: 0 }}
            title={character.name}
            rightIcon={<IconButton icon="menu" onPress={handleShowModal} />}
        >
            <Animated.View entering={SlideInRight.duration(500).delay(50)}>
                <Portal>
                    <ModalCharacterSettings
                        prompt={makeCharacterImgPrompt}
                        shouldShowModal={shouldShowModal}
                        setShouldShowModal={setShouldShowModal}
                        characterId={character.id}
                        handleCharacterImgChange={handleCharacterImgChange}
                    />
                </Portal>
                <VirtualizedScrollView
                    scrollEnabled
                    contentContainerStyle={{ paddingBottom: tabBarHeight }}
                >
                    <View>
                        <ImageBackground
                            source={
                                characterImgUri
                                    ? { uri: characterImgUri }
                                    : DND_CHARACTER_DEFAULT
                            }
                            style={styles.imageBackground}
                        >
                            <View style={styles.levelBadge}>
                                <CustomSelectionButton
                                    items={maxLevels}
                                    customStyle={{
                                        flexDirection: 'row',
                                    }}
                                    textColor={theme.colors.white}
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
                    </View>
                    <View style={styles.container}>
                        {accordions.map((accordion) => {
                            return (
                                <CustomButton
                                    key={accordion.id}
                                    style={{
                                        padding: theme.space.xs,
                                        borderWidth: 1,
                                        borderColor: theme.colors.primary,
                                    }}
                                    textSize={theme.fontSize.large}
                                    textColor={theme.colors.primary}
                                    buttonColor={'transparent'}
                                    text={t(accordion.title)}
                                    onPress={() =>
                                        handleAccordionPress(
                                            accordion.id,
                                            accordion.content,
                                            accordion.title
                                        )
                                    }
                                />
                            );
                        })}
                    </View>
                </VirtualizedScrollView>
            </Animated.View>
        </SafeView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.space.xl,
        gap: theme.space.md,
    },
    imageBackground: {
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT / 2,
    },
    accordionContainer: {
        backgroundColor: theme.colors.light,
    },
    accordionContent: {
        padding: theme.space.md,
    },
    // eslint-disable-next-line react-native/no-color-literals
    levelBadge: {
        position: 'absolute',
        left: theme.space.md,
        top: theme.space.md,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: theme.space.md,
        paddingVertical: theme.space.sm,
        borderRadius: theme.radius.md,
    },
    // eslint-disable-next-line react-native/no-color-literals
    lifePointsBadge: {
        position: 'absolute',
        top: theme.space.md,
        right: theme.space.md,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: theme.space.xl,
        borderRadius: theme.radius.md,
    },
});

export default CharacterOverviewDnd;
