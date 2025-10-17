import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Portal } from 'react-native-paper';

import CustomText from '@components/atom/CustomText';
import CustomButton from '@components/atom/CustomButton';
import { AidedDndModal } from '@components/character/dnd5e/AidedDndModal';
import { getSpellColor } from '@components/character/form/dnd5e/utils';

import { theme } from '../../../../../../style/theme.ts';

interface AdditionalSpellsProps {
    spellDataClass: Array<{
        level: number;
        spells: Array<{ index: string; schoolType: string }>;
    }>;
    className: string;
    level: number;
    subClassName?: string;
}

export const AdditionalSpells = ({
    spellDataClass,
    className,
    subClassName,
    level,
}: AdditionalSpellsProps) => {
    const { t } = useTranslation();
    const [spellName, setSpellName] = useState<string | undefined>(undefined);
    const [isSpellModalVisible, setIsSpellModalVisible] = useState(false);

    const handleShowModal = useCallback((name: string) => {
        setSpellName(name);
        setIsSpellModalVisible(true);
    }, []);

    if (!subClassName) return;

    const capitalizeFirstLetter = (str: string) => {
        return str[0].toUpperCase() + str.slice(1);
    };

    return spellDataClass
        ?.filter((spellEntry) => level >= spellEntry.level)
        .map((spellEntry, idx) => (
            <View
                key={idx}
                style={{
                    marginTop: theme.space.xs,
                    flex: 1,
                }}
            >
                <Portal>
                    <AidedDndModal
                        shouldShowModal={isSpellModalVisible}
                        setShouldShowModal={setIsSpellModalVisible}
                        type={'spells'}
                        language="vf"
                        name={spellName}
                    />
                </Portal>
                <CustomText text={`Sorts niveaux ${spellEntry.level}`} />
                <View style={styles.spellContainer}>
                    {spellEntry.spells.map((spell, spellIdx) => {
                        return (
                            <CustomButton
                                key={spellIdx}
                                buttonColor={theme.colors.transparent}
                                textColor={getSpellColor(spell.schoolType)}
                                radius={theme.radius.xs}
                                style={[
                                    styles.spellButtonContainer,
                                    {
                                        borderColor: getSpellColor(
                                            spell.schoolType
                                        ),
                                    },
                                ]}
                                onPress={() => {
                                    handleShowModal(
                                        t(
                                            `character.classes.${className}.subclasses.${subClassName}.spells.${idx}.${spell.index}`
                                        )
                                    );
                                }}
                                textSize={16}
                                text={capitalizeFirstLetter(
                                    `${t(
                                        `character.classes.${className}.subclasses.${subClassName}.spells.${idx}.${spell.index}`
                                    )}`.replaceAll('-', ' ')
                                )}
                            />
                        );
                    })}
                </View>
            </View>
        ));
};

const styles = StyleSheet.create({
    spellContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: theme.space.sm,
    },
    spellButtonContainer: {
        flex: 1,
        borderWidth: 1,
        margin: theme.space.xs,
        padding: theme.space.xs,
    },
});
