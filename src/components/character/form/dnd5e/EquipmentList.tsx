import { FC, Fragment, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import {
    DnDCharacter,
    ElementIdentification,
} from '../../../../types/games/d2d5e';
import CustomText from '../../../atom/CustomText';
import { theme } from '../../../../../style/theme';

interface EquipmentListProps {
    character: DnDCharacter;
}

const EquipmentList: FC<EquipmentListProps> = ({ character }) => {
    const { t } = useTranslation();
    const classEquipments = useMemo(
        () => character.className?.starting_equipment ?? [],
        [character.className]
    );

    const backgroundEquipments = useMemo(
        () => character.background?.starting_equipment ?? [],
        [character.background]
    );

    const selectedRaceOptions = useMemo(
        () =>
            character?.selectedRaceElements?.raceChoices?.[
                `${character.race.index}-race-proficiencies`
            ],
        [character?.selectedRaceElements?.raceChoices, character.race.index]
    );

    const selectedClassOptions = useMemo(
        () =>
            character?.selectedClassElements?.classChoices?.[
                `${character.className.index}-class-1`
            ],
        [
            character?.selectedClassElements?.classChoices,
            character.className.index,
        ]
    );

    // const backgroundOptions = useMemo(
    //     () => character.background?.starting_equipment_options ?? [],
    //     [character.background]
    // );
    //
    // const selectedBackgroundOptions = useMemo(
    //     () =>
    //         character?.selectedBackgroundElements?.backgroundChoices?.[
    //             `${character.className.index}-class-1`
    //         ],
    //     []
    // );

    const renderEquipment = (
        equipments: { equipment: ElementIdentification; quantity: number }[]
    ) =>
        equipments?.length > 0 && (
            <Fragment>
                {equipments.map((eq, index) => (
                    <CustomText
                        key={`${eq.equipment.index}-${index}`}
                        text={`• ${eq.equipment.name} x${eq.quantity}`}
                    />
                ))}

                <Divider style={styles.divider} />
            </Fragment>
        );

    const renderOptions = (options: any) =>
        options?.length > 0 && (
            <Fragment>
                {options?.map((option, index) => (
                    <CustomText
                        key={`option-${index}`}
                        text={`• ${t(
                            `character.starting_selections.${option.index}.name`
                        )}`}
                    />
                ))}

                <Divider style={styles.divider} />
            </Fragment>
        );

    return (
        <View style={styles.container}>
            <View>
                <CustomText
                    fontWeight="bold"
                    text={t('characterForm.baseClassEquipment')}
                    style={styles.sectionTitle}
                />
                {/*{renderEquipment(classEquipments)}*/}
                {renderOptions(
                    selectedRaceOptions
                    // t('characterForm.selectedClassEquipment')
                )}
                {renderOptions(
                    selectedClassOptions
                    // t('characterForm.selectedClassEquipment')
                )}
            </View>

            <View>
                <CustomText
                    fontWeight="bold"
                    text={t('characterForm.baseBackgroundEquipment')}
                    style={styles.sectionTitle}
                />
                {renderEquipment(classEquipments)}
                {renderEquipment(backgroundEquipments)}
            </View>

            {/*{renderOptions(backgroundOptions, 'Background Equipment Options')}*/}

            {/* If race equipment is to be used in future, you can extend here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.space.xs,
    },
    sectionTitle: {
        marginTop: theme.space.xl,
        marginBottom: theme.space.sm,
    },
    divider: {
        marginVertical: theme.space.xl,
    },
});

export default EquipmentList;
