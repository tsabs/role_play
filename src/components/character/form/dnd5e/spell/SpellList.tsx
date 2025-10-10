import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { DnDCharacter, DndClass, Spell, SpellData } from 'types/games/d2d5e';
import { GAME_TYPE } from 'types/generic';
import Animated, { FadeIn } from 'react-native-reanimated';

import CustomText from '@components/atom/CustomText';
import CustomSelectionButton from '@components/atom/CustomSelectionButton';
import CustomButton from '@components/atom/CustomButton';
import EditMode from '@components/library/EditMode';
import { useAppDispatch, useAppSelector } from '@store/index';
import {
    callUpdateCharacter,
    fetchSpells,
    loadSpecificTalentClassPerLevel,
} from '@store/character/slice';
import { selectCharacterById } from '@store/character/selectors';
import { calculateModifier } from '@utils/d2d5';

import { clericSubclasses } from '../classSpecifics/clerc/clericSubclasses';
import { warlockClasses } from '../classSpecifics/warlock/warlockClass';
import { paladinSubclasses } from '../classSpecifics/paladin/paladinClass';
import { AdditionalSpells } from '../spell/AdditionalSpells';
import { theme } from '../../../../../../style/theme';
import { getSpellColor } from '../utils';

import { SpellDescription } from './SpellDescription';

const SpellList = ({ characterId }: { characterId: string }) => {
    const dispatch = useAppDispatch();
    const [isOnEdit, setIsOnEdit] = useState(false);
    const character = useAppSelector(selectCharacterById(characterId));
    const [spellData, setSpellData] = useState<SpellData | undefined>(
        character?.selectedSpellSpecifics?.spellClassData
    );
    const [shouldShowSpellDescription, setShouldShowSpellDescription] =
        useState(false);
    const [selectedSpell, setSelectedSpell] = useState<{
        spell: Spell | undefined;
        isMinorSpell: boolean;
    }>(undefined);
    const [availableSpells, setAvailableSpells] = useState<Spell[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedCantrips, setSelectedCantrips] = useState<Spell[]>(
        character?.selectedSpellSpecifics?.selectedMinorSpells
    );
    const [selectedSpells, setSelectedSpells] = useState<Spell[]>(
        character?.selectedSpellSpecifics?.selectedSpells
    );

    const handleChangeSpellDescription = useCallback(
        (spell: Spell, isMSpell: boolean) => {
            if (!spell) return;
            setSelectedSpell((prevSpell) => {
                if (prevSpell?.spell?.index !== spell?.index) {
                    setShouldShowSpellDescription(true);
                } else {
                    setShouldShowSpellDescription(!shouldShowSpellDescription);
                }
                return { spell, isMinorSpell: isMSpell };
            });
        },
        [shouldShowSpellDescription]
    );

    const fetchAvailableSpells = useCallback(async () => {
        if (character.gameType !== GAME_TYPE.DND5E) return;
        try {
            const spells = await fetchSpells(
                character.className.index,
                '<=',
                character.level
            );
            setAvailableSpells(spells);
        } catch (error) {
            console.error('Error fetching spells:', error);
        }
    }, [character.gameType, character.className, character.level]);

    const handleChangeEditMode = useCallback(() => {
        setIsOnEdit(!isOnEdit);
    }, [isOnEdit]);

    const handleSpellSelection = (
        spell: Spell,
        index: number,
        isCantrip: boolean
    ) => {
        if (isCantrip) {
            setSelectedCantrips((prev) => {
                if (!prev) return [spell];
                const exists = prev.some((s) => s.index === spell.index);
                if (exists) {
                    // Remove the spell if it already exists (deselect logic)
                    return prev.filter((s) => s.index !== spell.index);
                }
                // Replace the cantrip at the given index or add it
                const updatedCantrips = [...prev];
                updatedCantrips[index] = spell;
                return updatedCantrips;
            });
        } else {
            setSelectedSpells((prev) => {
                if (!prev) return [spell];
                // Replace the spell at the specific index but ensure uniqueness by filtering out any duplicates
                const updatedSpells = [...prev];
                updatedSpells[index] = spell;
                // Remove potential duplicates (other than the one at the target index)
                return updatedSpells.filter(
                    (s, idx) => s.index !== spell.index || idx === index
                ); // Add selected spell
            });
        }
    };

    const handleSave = useCallback(async () => {
        if (character.gameType !== GAME_TYPE.DND5E) {
            console.error('Cannot update character: Invalid game type');
            return;
        }
        const payload = {
            selectedSpellSpecifics: {
                selectedSpells: selectedSpells || [],
                selectedMinorSpells: selectedCantrips || [],
                spellClassData: spellData,
            },
        };

        const updatedCharacter: DnDCharacter = { ...character, ...payload };

        try {
            await dispatch(callUpdateCharacter(updatedCharacter));
        } catch (error) {
            console.error('Failed to update character spells:', error);
        }
        setIsOnEdit(false);
    }, [character, dispatch, selectedCantrips, selectedSpells, spellData]);

    useEffect(() => {
        const fetchSpellData = async () => {
            if (character.gameType !== GAME_TYPE.DND5E) return;
            try {
                // Fetch spell data based on level & class
                const classData = await loadSpecificTalentClassPerLevel(
                    GAME_TYPE.DND5E, // Game type
                    character.className.index,
                    character.level.toString()
                );

                if (classData?.spellcasting) {
                    setSpellData(classData.spellcasting);
                }
            } catch (err) {
                console.log('Error fetching spell data:', err);
            }
        };
        Promise.all([fetchSpellData(), fetchAvailableSpells()]).finally(() =>
            setIsLoading(false)
        );
    }, [
        character.level,
        character.className,
        fetchAvailableSpells,
        character.gameType,
    ]);

    // Group spells by level
    const groupedSpells = useMemo(() => {
        const groups = availableSpells.reduce(
            (acc, spell) => {
                const level = spell.level || 0;
                if (!acc[level]) acc[level] = [];
                acc[level].push({ label: spell.name, value: spell });
                return acc;
            },
            {} as Record<number, { label: string; value: Spell }[]>
        );

        const orderedList: {
            label: string;
            value: Spell;
            selectable: boolean;
        }[] = [];

        Object.entries(groups)
            .sort(([levelA], [levelB]) => Number(levelA) - Number(levelB)) // Sort levels numerically
            .forEach(([level, spells]) => {
                // Add level separator
                orderedList.push({
                    label: `Level ${level} Spells`,
                    value: { level: level } as unknown as Spell,
                    selectable: false, // Mark as a separator
                });
                // Add spells for this level
                spells
                    .sort((a, b) => a?.label.localeCompare(b?.label)) // Sort spells alphabetically
                    .forEach((spell) => {
                        orderedList.push({
                            label: spell.label,
                            value: spell.value,
                            selectable: true,
                        });
                    });
            });

        return orderedList;
    }, [availableSpells]);

    const renderSpell = useCallback(
        ({ item: i, index }, isMinorSpell: boolean) => {
            const spells = isMinorSpell ? selectedCantrips : selectedSpells;
            const item = spells?.[index];
            return isOnEdit ? (
                <Animated.View
                    entering={FadeIn.duration(500)}
                    style={{
                        flex: 1,
                    }}
                >
                    <CustomSelectionButton
                        items={groupedSpells.filter((spell) =>
                            isMinorSpell
                                ? spell.value?.level === 0
                                : spell.value?.level > 0
                        )}
                        textColor={getSpellColor(item?.school?.index)}
                        preSelectedValue={
                            item
                                ? {
                                      label: item.name,
                                      value: index,
                                  }
                                : undefined
                        }
                        onSelect={(value) => {
                            handleChangeSpellDescription(value, isMinorSpell);
                            handleSpellSelection(value, index, isMinorSpell);
                        }}
                        sectionValue={(spell: Spell) =>
                            getSpellColor(spell?.school?.index)
                        }
                        placeHolder="Sélectionner un sort"
                        customStyle={styles.spellButton}
                    />
                </Animated.View>
            ) : (
                <View style={[styles.spellContainer]}>
                    <CustomButton
                        onPress={() =>
                            handleChangeSpellDescription(item, isMinorSpell)
                        }
                        disabled={!item?.name}
                        style={{
                            ...styles.spellButtonContainer,
                            backgroundColor: item?.name
                                ? theme.colors.transparent
                                : theme.colors.light,
                            borderColor: item?.name
                                ? getSpellColor(item?.school?.index)
                                : theme.colors.primary,
                        }}
                        textSize={theme.fontSize.large}
                        textColor={
                            item?.name
                                ? getSpellColor(item?.school?.index)
                                : theme.colors.secondary
                        }
                        buttonColor={theme.colors.transparent}
                        text={item?.name ? item.name : 'Sort à sélectionner'}
                    />
                </View>
            );
        },
        [
            groupedSpells,
            handleChangeSpellDescription,
            isOnEdit,
            selectedCantrips,
            selectedSpells,
        ]
    );

    const spellSlots = useMemo(
        () =>
            spellData
                ? Object.entries(spellData)?.filter(
                      (elem) => elem?.[0]?.includes('spell_slots')
                  )
                : undefined,
        [spellData]
    );

    const spellKnown = useMemo(() => {
        if (character.gameType !== GAME_TYPE.DND5E) return;
        switch (character.className.index) {
            case 'bard':
            case 'warlock':
            case 'ranger':
            case 'sorcerer':
                return spellData?.spells_known || 0;
            case 'druid':
            case 'cleric':
                return (
                    character.level +
                    calculateModifier(character.abilities['WIS'])
                );
            case 'wizard':
                return (
                    character.level +
                    calculateModifier(character.abilities['INT'])
                );
            case 'paladin':
                return character.level >= 2
                    ? Math.ceil(character.level / 2) +
                          calculateModifier(character.abilities['CHA'])
                    : 0;
            default:
                return 0;
        }
    }, [
        character.abilities,
        character.className,
        character.gameType,
        character.level,
        spellData?.spells_known,
    ]);

    const spellDataClass: Array<{
        level: number;
        spells: Array<{ index: string; schoolType: string }>;
    }> = useMemo(() => {
        switch ((character.className as DndClass).index) {
            case 'paladin':
                return (
                    paladinSubclasses(
                        character.selectedClassElements?.selected_subclass
                    )[character.selectedClassElements?.selected_subclass]
                        ?.spells || []
                );
            case 'cleric':
                return (
                    clericSubclasses(
                        character.selectedClassElements?.selected_subclass
                    )[character.selectedClassElements?.selected_subclass]
                        ?.spells || []
                );
            case 'warlock':
                return (
                    warlockClasses(
                        character.selectedClassElements?.selected_subclass
                    )?.spells || []
                );
            default:
                return [];
        }
    }, [
        character.className,
        character.selectedClassElements?.selected_subclass,
    ]);

    if (isLoading) {
        return <CustomText text="Loading spells..." />;
    }

    if (availableSpells.length === 0)
        return (
            <CustomText text="No available spells for this level/class combination." />
        );

    return !spellKnown && !spellData?.cantrips_known ? (
        <CustomText text="Vous ne connaissez pas encore de sorts" />
    ) : (
        <View style={styles.container}>
            <EditMode
                style={{ flexDirection: 'row' }}
                isOnEdit={isOnEdit}
                isEditModeEnabled
                handleChange={handleChangeEditMode}
                handleSave={handleSave}
            />

            <View style={styles.section}>
                <CustomText
                    fontWeight="bold"
                    fontSize={theme.fontSize.large}
                    text="Available Spell Slots"
                />
                {spellSlots?.length > 0 ? (
                    spellSlots.map(([slotLevel, available], index) =>
                        available ? (
                            <View style={{ flexDirection: 'row' }} key={index}>
                                <CustomText
                                    text={`Level ${slotLevel.slice(-1)}: `}
                                    fontSize={theme.fontSize.medium}
                                    fontWeight="400"
                                />
                                <CustomText
                                    text={available}
                                    fontWeight="600"
                                    color={theme.colors.primary}
                                    fontSize={theme.fontSize.medium}
                                />
                            </View>
                        ) : null
                    )
                ) : (
                    <CustomText text={'No spell slots available.'} />
                )}
            </View>

            <Fragment>
                <CustomText
                    fontWeight="bold"
                    fontSize={theme.fontSize.large}
                    text="Sorts mineurs: "
                />
                {parseInt(spellData?.cantrips_known, 10) > 0 ? (
                    <Fragment>
                        <FlatList
                            data={[
                                ...Array(
                                    parseInt(spellData?.cantrips_known, 10) ||
                                        []
                                ),
                            ]}
                            style={styles.list}
                            numColumns={2}
                            keyExtractor={(_, idx) => idx.toString(10)}
                            renderItem={(item) => renderSpell(item, true)}
                        />
                        <SpellDescription
                            shouldShow={
                                shouldShowSpellDescription &&
                                selectedSpell?.isMinorSpell
                            }
                            spell={selectedSpell?.spell}
                        />
                    </Fragment>
                ) : (
                    <View style={styles.noSpellSection}>
                        <CustomText
                            fontWeight="300"
                            text="Pas de sort mineur disponible"
                        />
                    </View>
                )}
            </Fragment>
            <View style={styles.bottomListContainer}>
                <CustomText
                    fontWeight="bold"
                    fontSize={theme.fontSize.large}
                    text="Sorts majeurs: "
                />
                <FlatList
                    style={styles.list}
                    numColumns={2}
                    contentContainerStyle={{ alignItems: 'center' }}
                    data={[...Array(spellKnown || [])]}
                    keyExtractor={(_, idx) => idx.toString(10)}
                    renderItem={(item) => renderSpell(item, false)}
                />
                <SpellDescription
                    shouldShow={
                        shouldShowSpellDescription &&
                        !selectedSpell?.isMinorSpell
                    }
                    spell={selectedSpell?.spell}
                />
            </View>
            {spellDataClass?.length ? (
                <View style={styles.additionalSpells}>
                    <CustomText
                        fontWeight="bold"
                        fontSize={theme.fontSize.large}
                        text="Sorts connus additionels: "
                    />
                    <AdditionalSpells
                        spellDataClass={spellDataClass}
                        className={(character.className as DndClass).index}
                        subClassName={
                            character.selectedClassElements.selected_subclass
                        }
                        level={character.level}
                    />
                </View>
            ) : undefined}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.space.xxl,
        backgroundColor: theme.colors.light,
    },
    section: {
        gap: theme.space.md,
        marginBottom: theme.space.l,
    },
    noSpellSection: {
        paddingLeft: theme.space.md,
    },
    spellButton: {
        borderWidth: 1,
        borderRadius: theme.radius.xs,
        margin: theme.space.xs,
        padding: theme.space.xs,
    },
    bottomListContainer: {
        paddingTop: theme.space.md,
    },
    spellContainer: {
        flex: 1,
        margin: theme.space.sm,
        maxWidth: '48%', // Adjust for a 2-column layout with some space for margins
    },
    spellButtonContainer: {
        padding: theme.space.xs,
        borderWidth: 1,
        borderRadius: theme.radius.xs,
    },
    list: {
        gap: theme.space.md,
        flexGrow: 0,
    },
    additionalSpells: {
        flex: 1,
        paddingVertical: theme.space.md,
    },
});

export default SpellList;
