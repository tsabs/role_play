import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Portal } from 'react-native-paper';
import { Monster, Spell } from 'types/games/d2d5e';

import CustomButton from '@components/atom/CustomButton';
import CustomText from '@components/atom/CustomText';
import { AidedDndModal } from '@components/character/dnd5e/AidedDndModal';
import { getInvokableMonsters } from '@store/character/dnd5e/services';
import { getSpellColor } from '@components/character/form/dnd5e/utils';
import Separator from '@components/library/Separator';

import { theme } from '../../../../../../style/theme';

interface SpellDescriptionProps {
    shouldShow: boolean;
    spell: Spell;
}

export const SpellDescription = ({
    shouldShow,
    spell,
}: SpellDescriptionProps) => {
    const [invokableMonsters, setInvokableMonsters] = useState<Monster[]>([]);
    const [monsterName, setMonsterName] = useState<string | undefined>(
        undefined
    );
    const [isMonsterModalVisible, setIsMonsterModalVisible] = useState(false);
    const [isSpellModalVisible, setIsSpellModalVisible] = useState(false);
    const spellColor = useMemo(
        () => getSpellColor(spell?.school?.index || ''),
        [spell?.school?.index]
    );

    const callFetchInvokableMonsters = useCallback(async () => {
        if (!spell?.invokableCreatures) return;
        await getInvokableMonsters(spell.invokableCreatures).then((res) => {
            setInvokableMonsters(res);
        });
    }, [spell?.invokableCreatures]);

    useEffect(() => {
        callFetchInvokableMonsters();
    }, [callFetchInvokableMonsters]);

    const spellDamage =
        spell?.damage?.damage_at_character_level?.[1] ||
        spell?.damage?.damage_at_slot_level?.[1];

    return (
        shouldShow && (
            <View style={{ ...styles.container, borderColor: spellColor }}>
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'space-evenly',
                        }}
                    >
                        <View style={styles.textContainer}>
                            <CustomText text={`Ecole de sort: `} />
                            <CustomText
                                fontWeight="bold"
                                color={getSpellColor(spell?.school?.index)}
                                text={spell?.school?.name}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <CustomText text={`Temps d'incantation: `} />
                            <CustomText
                                fontWeight="bold"
                                color={getSpellColor(spell?.school?.index)}
                                text={spell.casting_time}
                            />
                        </View>
                        {spell?.level ? (
                            <View style={styles.textContainer}>
                                <CustomText text={`Niveau du sort: `} />
                                <CustomText
                                    fontWeight="bold"
                                    color={getSpellColor(spell?.school?.index)}
                                    text={`${spell.level}`}
                                />
                            </View>
                        ) : undefined}
                        {spell?.duration ? (
                            <View style={styles.textContainer}>
                                <CustomText text={`Durée du sort: `} />
                                <CustomText
                                    fontWeight="bold"
                                    color={getSpellColor(spell?.school?.index)}
                                    text={spell?.duration}
                                />
                            </View>
                        ) : undefined}
                        {spellDamage ? (
                            <View style={styles.textContainer}>
                                <CustomText
                                    text={`Dommages initiaux du sorts: `}
                                />
                                <CustomText
                                    fontWeight="bold"
                                    color={getSpellColor(spell?.school?.index)}
                                    text={`${spellDamage}`}
                                />
                            </View>
                        ) : undefined}
                    </View>

                    <View
                        style={{
                            flex: 1,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                        }}
                    >
                        <IconButton
                            style={{
                                borderWidth: 1,
                                borderColor: getSpellColor(spell.school.index),
                            }}
                            iconColor={getSpellColor(spell.school.index)}
                            onPress={() => setIsSpellModalVisible(true)}
                            icon="script"
                        />
                    </View>
                </View>
                <Portal>
                    <AidedDndModal
                        shouldShowModal={isSpellModalVisible}
                        setShouldShowModal={setIsSpellModalVisible}
                        type="spells"
                        name={spell.index}
                    />
                </Portal>

                {/*<Separator margin={theme.space.md} horizontal />*/}
                {/*{spell?.desc?.map((d, i) => {*/}
                {/*    return (*/}
                {/*        <CustomText*/}
                {/*            key={i}*/}
                {/*            style={styles.descriptionSpellText}*/}
                {/*            text={d}*/}
                {/*        />*/}
                {/*    );*/}
                {/*})}*/}
                <Portal>
                    <AidedDndModal
                        shouldShowModal={isMonsterModalVisible}
                        setShouldShowModal={setIsMonsterModalVisible}
                        type="monsters"
                        name={monsterName}
                    />
                </Portal>
                <Separator margin={theme.space.md} horizontal />
                {spell?.invokableCreatures?.length > 0 &&
                    invokableMonsters?.length > 0 && (
                        <View style={styles.monsterContainer}>
                            <CustomText
                                fontWeight="bold"
                                text={'Créature invocables: '}
                            />
                            {invokableMonsters?.map((monster) => (
                                <View
                                    key={monster.index}
                                    style={styles.monsterRow}
                                >
                                    <CustomButton
                                        radius={theme.radius.sm}
                                        text={monster.name}
                                        onPress={() => {
                                            setMonsterName(monster.index);
                                            setIsMonsterModalVisible(true);
                                        }}
                                    />
                                </View>
                            ))}
                        </View>
                    )}
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        margin: theme.space.md,
        padding: theme.space.xl,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    textContainer: {
        flexDirection: 'row',
    },
    descriptionSpellText: { lineHeight: 20 },
    monsterContainer: {
        // flex: 1,
        // backgroundColor: 'red',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.space.md,
    },
    monsterRow: {
        flex: 0,
        marginHorizontal: theme.space.l,
        // backgroundColor: 'red',
        // flexWrap: 'wrap',
        // alignItems: 'center',
        marginBottom: theme.space.sm,
    },
    monsterButton: {
        // bor
    },
});
