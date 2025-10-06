import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
    SelectedClassElementsProps,
    SelectedRaceElementsProps,
} from 'types/games/d2d5e';
import { GAME_TYPE } from 'types/generic';

import CustomText from '@components/atom/CustomText';
import CustomSelectionButton from '@components/atom/CustomSelectionButton';
import { getFeaturesByClass } from '@store/character/dnd5e/services';

import DisplaySelection from '../../atom/DisplaySelection';
import { WarlockChain } from '../../subclassSpecifics/warlock/WarlockChain';
import { genericClassFormStyles } from '../../genericStyle';
import { theme } from '../../../../../../../style/theme';

import { warlockClasses } from './warlockClass';

interface WarlockTalentFormProps {
    level: number;
    gameType: GAME_TYPE;
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
    isOnEdit,
    subclass,
    handleSubclassChoices,
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

    const selectedPatronPact = useMemo(
        () => selectedClassElements?.classChoices?.['patron-pact']?.[0]?.index,
        [selectedClassElements?.classChoices]
    );

    const [localChoices, setLocalChoices] = useState<Record<string, string>>({
        patronPacts: selectedPatronPact || '',
    });

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

    const handleChange = useCallback((value: string, type: string) => {
        setLocalChoices((prev) => ({
            ...prev,
            [type]: value,
        }));
    }, []);

    useEffect(() => {
        const formattedChoices = {
            'patron-pact': localChoices.patronPacts
                ? [{ index: localChoices.patronPacts }]
                : [],
        };

        handleSubclassChoices({
            ...selectedClassElements?.classChoices,
            ...formattedChoices,
        });
    }, [
        handleSubclassChoices,
        localChoices,
        selectedClassElements?.classChoices,
    ]);

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
                    .filter((feature) => feature.level <= level)
                    .filter(
                        (feature) =>
                            feature.index.includes('eldritch-invocation') &&
                            feature.index !== 'eldritch-invocations'
                    )
            );
        });
    }, [level]);

    const handleInvocationSelection = useCallback(
        (index: number, invocation: string) => {
            const updatedSelections = [...selectedInvocations];
            updatedSelections[index] = invocation; // Update the specific index

            const selections: Array<{ index: string }> = updatedSelections?.map(
                (select) => ({
                    index: select,
                })
            );

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

    const displaySubClasses = (patronPactName: string) => {
        switch (patronPactName) {
            case 'chain':
                return <WarlockChain />;
        }
    };

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
            <CustomText fontSize={14} text={t(`${data.descriptionKey}`)} />

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
                                            (inv) => {
                                                return {
                                                    label: t(
                                                        `character.classes.warlock.eldritchInvocations.${inv.index}.name`
                                                    ).replace(
                                                        'Invocation Étrange : ',
                                                        ''
                                                    ),
                                                    value: t(
                                                        `character.classes.warlock.eldritchInvocations.${inv.index}.index`
                                                    ),
                                                    selectable: true,
                                                };
                                            }
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

            {level >= 3 && (
                <View>
                    <DisplaySelection
                        isOnEdit={isOnEdit}
                        className={'warlock'}
                        handleChange={handleChange}
                        type={'patronPacts'}
                        selectedValue={localChoices.patronPacts}
                    />
                    {displaySubClasses(localChoices.patronPacts)}
                </View>
            )}
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
