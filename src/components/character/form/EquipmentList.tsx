import { FC, Fragment, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import {
    DnDCharacter,
    ElementIdentification,
} from '../../../types/games/d2d5e';
import CustomText from '../../atom/CustomText';
import { useTranslation } from 'react-i18next';

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

    const backgroundOptions = useMemo(
        () => character.background?.starting_equipment_options ?? [],
        [character.background]
    );

    const selectedBackgroundOptions = useMemo(
        () =>
            character?.selectedBackgroundElements?.backgroundChoices?.[
                `${character.className.index}-class-1`
            ],
        []
    );

    const renderEquipment = (
        equipments: { equipment: ElementIdentification; quantity: number }[],
        title: string
    ) => (
        <>
            <CustomText
                fontWeight="bold"
                text={title}
                style={styles.sectionTitle}
            />
            {equipments.map((eq, index) => (
                <CustomText
                    key={`${eq.equipment.index}-${index}`}
                    text={`• ${eq.equipment.name} x${eq.quantity}`}
                />
            ))}
            <Divider style={styles.divider} />
        </>
    );

    const renderOptions = (options: any, title: string) =>
        selectedClassOptions?.length > 0 && (
            <Fragment>
                <CustomText
                    fontWeight="bold"
                    text={title}
                    style={styles.sectionTitle}
                />
                {selectedClassOptions?.map((option, index) => (
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
            {renderEquipment(
                classEquipments,
                t('characterForm.baseClassEquipment')
            )}
            {renderOptions(
                selectedClassOptions,
                t('characterForm.selectedClassEquipment')
            )}

            {renderEquipment(
                backgroundEquipments,
                t('characterForm.baseBackgroundEquipment')
            )}
            {/*{renderOptions(backgroundOptions, 'Background Equipment Options')}*/}

            {/* If race equipment is to be used in future, you can extend here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 4,
    },
    sectionTitle: {
        marginTop: 12,
        marginBottom: 6,
    },
    divider: {
        marginVertical: 12,
    },
});

export default EquipmentList;
