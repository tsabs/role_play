import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
    SelectedClassElementsProps,
    SelectedRaceElementsProps,
} from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import CustomSelectionButton from '@components/atom/CustomSelectionButton';
import { getFeaturesByClass } from '@store/character/dnd5e/services';

import { genericClassFormStyles } from '../../genericStyle';
import { theme } from '../../../../../../../style/theme';

import { warlockClasses } from './warlockClass';

interface WarlockTalentFormProps {
    level: number;
    abilities: Record<string, number>;
    isOnEdit: boolean;
    subclass?: string;
    handleSubclassChoices: (
        subclassChoices: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >
    ) => void;
    selectedRaceElements?: SelectedRaceElementsProps;
    selectedClassElements?: SelectedClassElementsProps;
}

export const WarlockTalentForm = ({
    level,
    abilities,
    isOnEdit,
    subclass,
    handleSubclassChoices,
    selectedRaceElements,
    selectedClassElements,
}: WarlockTalentFormProps) => {
    const { t } = useTranslation();

    const [eldritchInvocations, setEldritchInvocations] = useState([]);
    const selectedInvocationsFromClass = useMemo(
        () =>
            selectedClassElements?.classChoices?.[
                'eldritch-invocations'
            ] as Array<{ index: string }>,
        [selectedClassElements?.classChoices]
    );

    const [selectedInvocations, setSelectedInvocations] = useState<
        Array<string>
    >([]);

    const data = useMemo(() => warlockClasses(subclass), [subclass]);

    const totalInvocationSlots = useMemo(() => {
        const available = data.eldritchInvocations
            .filter((e) => level >= e.level) // Filter levels less than or equal to the current level
            .pop(); // Get the highest applicable level
        return available ? available.count : 0; // Default to 0 if no levels are met
    }, [level, data.eldritchInvocations]);

    const callGetFeaturesByClass = useCallback(() => {
        getFeaturesByClass('warlock').then((features) => {
            // console.log(
            //     'Warlock features',
            //     features
            //         .filter((feature) => feature.level <= '2')
            //         .filter((feature) =>
            //             feature.index.includes('eldritch-invocation')
            //         )
            //         .map((feature) => ({
            //             name: feature.name,
            //             // index: feature.index,
            //             desc: feature.desc[0],
            //         }))
            // );
            setEldritchInvocations(
                features
                    .filter((feature) => feature.level <= '2')
                    .filter(
                        (feature) =>
                            feature.index.includes('eldritch-invocation') &&
                            feature.index !== 'eldritch-invocations'
                    )
            );
        });
    }, []);

    const handleInvocationSelection = useCallback(
        (index: number, invocation: string) => {
            const updatedSelections = [...selectedInvocations];
            updatedSelections[index] = invocation; // Update the specific index

            const selections: Array<{ index: string }> = updatedSelections?.map(
                (select) => ({
                    index: select,
                })
            );

            // console.log('formattedChoices:', formattedChoices);
            console.log('selections: ', selections);
            setSelectedInvocations(updatedSelections);
            handleSubclassChoices({
                ...selectedClassElements.classChoices,
                ['eldritch-invocations']: selections,
            });
        },
        [
            handleSubclassChoices,
            selectedClassElements.classChoices,
            selectedInvocations,
        ]
    );

    useEffect(() => {
        callGetFeaturesByClass();
    }, [callGetFeaturesByClass]);

    useEffect(() => {
        if (selectedInvocationsFromClass) {
            setSelectedInvocations(
                selectedInvocationsFromClass.map((item) => item.index)
            );
        } else {
            setSelectedInvocations(Array(totalInvocationSlots).fill(null));
        }
    }, [totalInvocationSlots, selectedInvocationsFromClass]);

    if (!subclass) {
        return;
    }

    return (
        <View style={genericClassFormStyles.container}>
            <CustomText
                // style={genericClassFormStyles.sectionTitle}
                fontSize={14}
                // fontWeight="bold"
                text={t(`${data.descriptionKey}`)}
            />

            <CustomText
                style={genericClassFormStyles.sectionTitle}
                fontSize={14}
                fontWeight="bold"
                text={t(`Patron bonuses`)}
            />

            {/* Features unlocked by level */}
            {data.features
                .filter((feature) => level >= feature.level)
                .map((feature, idx) => (
                    <CustomText
                        key={idx}
                        text={`• ${t(feature.descriptionKey)}`}
                    />
                ))}

            <View style={styles.invocationContainer}>
                {[...Array(totalInvocationSlots)].map((_, idx) => {
                    const label = selectedInvocations?.[idx]
                        ? t(
                              `character.classes.warlock.eldritchInvocations.${selectedInvocations[idx]}.name`
                          )?.replace('Invocation Étrange : ', '')
                        : '';
                    return (
                        <View key={idx} style={styles.invocationSlot}>
                            <View>
                                {isOnEdit ? (
                                    <CustomSelectionButton
                                        key={idx}
                                        customStyle={styles.invocationButton}
                                        items={eldritchInvocations.map(
                                            (inv) => ({
                                                label: inv.name.replace(
                                                    'Eldritch Invocation: ',
                                                    ''
                                                ),
                                                value: inv.index,
                                                selectable: true,
                                            })
                                        )}
                                        displayValue={label}
                                        preSelectedValue={{
                                            label: label,
                                            value: selectedInvocations?.[idx],
                                        }}
                                        onSelect={(val) => {
                                            handleInvocationSelection(idx, val);
                                        }}
                                    />
                                ) : (
                                    <View style={styles.invocationText}>
                                        <CustomText
                                            fontWeight="bold"
                                            fontSize={14}
                                            text={label}
                                        />
                                    </View>
                                )}
                            </View>
                            <CustomText
                                style={styles.invocationDescription}
                                text={
                                    selectedInvocations[idx]
                                        ? t(
                                              `character.classes.warlock.eldritchInvocations.${selectedInvocations[idx]}.desc`
                                          )
                                        : ''
                                }
                            />
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.space.xxl,
    },
    invocationContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.space.md,
        justifyContent: 'space-between',
    },
    invocationSlot: {
        flex: 0.5,
        marginBottom: theme.space.xxl,
    },
    invocationText: {
        marginTop: theme.space.sm,
    },
    invocationButton: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.light,
    },
    invocationDescription: {
        marginTop: 8,
        color: theme.colors.textSecondary,
    },
});
