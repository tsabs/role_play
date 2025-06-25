import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Divider, IconButton, List, Portal } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Ability, Character } from 'types/generic';
import { DnDAbility, DnDCharacter } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import CustomSelectionButton from '@components/atom/CustomSelectionButton';
import { ABILITIES } from '@components/character/form/dnd5e/constants';
import AbilityForm from '@components/character/form/generic/AbilityForm';
import TalentClassForm from '@components/character/form/dnd5e/TalentClassForm';
import SkillsList from '@components/character/form/dnd5e/SkillsList';
import VirtualizedScrollView from '@components/library/VirtualizedScrollView';
import EquipmentList from '@components/character/form/dnd5e/EquipmentList';
import SafeView from '@components/library/SafeView';
import {
    callUpdateCharacter,
    loadClassData,
    loadSpecificTalentClassPerLevel,
} from '@store/character/slice';
import { useAppDispatch } from '@store/index';
import {
    extractCharacterProficiencies,
    maxLevels,
    mergeAbilityBonuses,
    remainingPoints,
    transformRaceAbilities,
} from '@utils/d2d5';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@utils/utils';

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
    const dispatch = useAppDispatch();
    const tabBarHeight = useBottomTabBarHeight();
    const [currentForm, setCurrentForm] = useState<string | undefined>(
        undefined
    );
    const [classData, setClassData] = useState(undefined);

    const [isEditMode, setIsEditMode] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [level, setLevel] = useState(character.level);
    const [selectedAbilities, setSelectedAbilities] = useState<
        Record<Ability, number> | undefined
    >(undefined);
    const [selectedClassElements, setSelectedClassElements] = useState<{
        selected_subclass?: string;
        classChoices?: Record<string, Array<{ index: string; bonus?: number }>>;
    }>(character.selectedClassElements);
    const [shouldShowModal, setShouldShowModal] = useState(false);
    const [characterImgUri, setCharacterImgUri] = useState(character?.imageUri);

    const handleShowModal = useCallback(() => {
        setShouldShowModal(!shouldShowModal);
    }, [shouldShowModal]);

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

    useEffect(() => {
        Promise.all([handleClassSpecificTalent(), handleClassData()]);
    }, [handleClassSpecificTalent, handleClassData]);

    useEffect(() => {
        if (selectedAbilities === undefined) {
            setSelectedAbilities(
                character?.abilities as Record<Ability, number>
            );
        }
    }, [character?.abilities, selectedAbilities]);

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
                imageUri: imgUri,
            };
            await callUpdateCharacter(updatedCharacter, dispatch);
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
                imgUri: characterImgUri,
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
                imgUri: characterImgUri,
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

    const getAbilitiesFinalScore = useCallback(() => {
        const result = { ...selectedAbilities };
        mergeAbilities.forEach(({ index, bonus }) => {
            const key = index.toUpperCase();
            if (result && result?.[key] !== undefined) {
                result[key] += bonus;
            }
        });
        return result;
    }, [selectedAbilities, mergeAbilities]);

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
                        abilities={
                            (selectedAbilities as Record<DnDAbility, number>) ||
                            ABILITIES
                        }
                        onChange={handleUpdateCharacter}
                        onSaveEdit={handleSaveEdit}
                        isEditModeEnabled
                        onEditMode={handleEditMode}
                        isEditMode={isEditMode}
                        abilityBonuses={mergeAbilities}
                        remainingPoints={remainingPoints(
                            selectedAbilities || ABILITIES
                        )}
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
                content: <CustomText text="Will come soon" />,
            },
        ];
    }, [
        character,
        level,
        selectedAbilities,
        handleUpdateCharacter,
        handleSaveEdit,
        handleEditMode,
        selectedClassElements,
        handleSubclassChange,
        isEditMode,
        mergeAbilities,
        getAbilitiesFinalScore,
        t,
    ]);

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

    const makeCharacterImgPrompt = useMemo(() => {
        const gameTypeTrad = t(`games.${character.gameType}.name`);
        const raceTrad = t(`character.races.${character.race.index}.name`);
        const classTrad = t(
            `character.classes.${character.className.index}.name`
        );
        const backgroundTrad = t(
            `character.backgrounds.${character.background.index}.name`
        );
        const subClass = selectedClassElements?.selected_subclass
            ? `et sous classe ${t(
                  `character.classes.${character.className.index}.subclasses.${selectedClassElements.selected_subclass}.title`
              )}`
            : '';
        const style =
            'en style semi-réaliste inspiré des Royaumes Oubliés (RA Salvatore).';

        // const shouldNotDisplay =
        //     "Important, ne pas afficher de texte, de description, de bordure ou de mise en page graphique. L’image doit être une scène illustrée, ce n'est en aucun cas un document.";

        return (
            `Image vertical de qualité professionnelle, ${style}\n` +
            'Le genre et apparence du personnage dépendent de sa description.\n' +
            `Le personnage est un ${raceTrad}, de classe ${classTrad} ${
                subClass ? subClass : ''
            }. Issu(e) d’un passé de type ${backgroundTrad}, dans l’univers ${gameTypeTrad}.\n` +
            `Description : ${character.description}\n` +
            `Histoire : ${character.additionalBackground}\n` +
            `Le personnage est représenté en pied (corps entier), dans un environnement détaillé lié à son histoire : montagne, cité médiévale, forêt enchantée, temple en ruine, bord de mer etc.` +
            `Aucun texte, aucune bordure, aucune interface ou fiche détaillé, juste l’illustration du personnage dans son environnement. Il ou elle peut etre réprésenté en pleine action ou en pause, mais sans texte ni éléments graphiques.`
        );
    }, [
        character.additionalBackground,
        character.background.index,
        character.className.index,
        character.description,
        character.gameType,
        character.race.index,
        selectedClassElements.selected_subclass,
        t,
    ]);

    // console.log(makeCharacterImgPrompt);

    return (
        <SafeView
            parentStyles={{ flex: 1, padding: 0 }}
            title={character.name}
            rightIcon={<IconButton icon="menu" onPress={handleShowModal} />}
        >
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
                <Animated.View entering={FadeIn.duration(750).delay(100)}>
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
                                title={
                                    <CustomText
                                        fontSize={16}
                                        text={t(accordion.title)}
                                    />
                                }
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
            </VirtualizedScrollView>
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
