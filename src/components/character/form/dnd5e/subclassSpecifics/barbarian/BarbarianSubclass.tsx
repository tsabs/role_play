import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';

import { SelectedClassElementsProps } from '../../../../../../types/games/d2d5e';
import CustomText from '../../../../../atom/CustomText';
import { genericClassFormStyles } from '../../classSpecifics/genericStyle';
import CustomSelectionButton from '../../../../../atom/CustomSelectionButton';
import { theme } from '../../../../../../../style/theme';

import { barbarianSubclasses, totemAnimalData } from './barbarianSubclasses';

interface BarbarianSubclassProps {
    subclass: string;
    selectedClassElements: SelectedClassElementsProps;
    isOnEdit: boolean;
    handleSubclassChoices: (
        subclassChoices: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >
    ) => void;
    level: number;
}

const BarbarianSubclass = ({
    subclass,
    selectedClassElements,
    isOnEdit,
    handleSubclassChoices,
    level,
}: BarbarianSubclassProps) => {
    const { t } = useTranslation();

    const data = useMemo(
        () => barbarianSubclasses[subclass as keyof typeof barbarianSubclasses],
        [subclass]
    );

    const selectedTotem = useMemo(
        () => selectedClassElements?.classChoices?.['totem-spirit']?.[0]?.index,
        [selectedClassElements?.classChoices]
    );

    const [totem, setTotem] = useState(selectedTotem);

    const totemOptions = useMemo(
        () =>
            totemAnimalData.map((animal) => ({
                label: t(animal.label),
                value: animal.value,
            })),
        [t]
    );

    const handleChange = useCallback(
        (value: string) => {
            console.log({
                ...selectedClassElements.classChoices,
                ['totem-spirit']: [{ index: value }],
            });
            setTotem(value);
            handleSubclassChoices({
                ...selectedClassElements.classChoices,
                ['totem-spirit']: [{ index: value }],
            });
        },
        [selectedClassElements, handleSubclassChoices]
    );

    const displaySubclassSpecifics = useCallback(() => {
        if (subclass === 'totem') {
            return isOnEdit ? (
                <View>
                    <CustomSelectionButton
                        customStyle={{
                            borderWidth: 1,
                            backgroundColor: theme.colors.light,
                            borderRadius: theme.radius.sm,
                            borderColor: theme.colors.primary,
                            marginTop: theme.space.md,
                        }}
                        preSelectedValue={{
                            label: `${t(
                                `character.classes.barbarian.subclasses.${subclass}.spiritAnimalFeatures.${totem}.index`
                            )}`,
                            value: totem,
                        }}
                        displayValue={
                            totem
                                ? `${t(
                                      `character.classes.barbarian.subclasses.${subclass}.spiritAnimalFeatures.${totem}.index`
                                  )}`
                                : 'Choisir un esprit totem'
                        }
                        placeHolder="Choisir un esprit totem"
                        items={totemOptions}
                        onSelect={handleChange}
                    />
                    {totem && (
                        <View>
                            <CustomText
                                fontWeight="bold"
                                text={t(
                                    `character.classes.barbarian.subclasses.${subclass}.spiritAnimalFeatures.${totem}.index`
                                )}
                            />
                            <CustomText
                                text={t(
                                    `character.classes.barbarian.subclasses.${subclass}.spiritAnimalFeatures.${totem}.description`
                                )}
                            />
                        </View>
                    )}
                </View>
            ) : totem ? (
                <View>
                    <CustomText
                        fontWeight="bold"
                        text={t(
                            `character.classes.barbarian.subclasses.${subclass}.spiritAnimalFeatures.${totem}.index`
                        )}
                    />
                    <CustomText
                        text={t(
                            `character.classes.barbarian.subclasses.${subclass}.spiritAnimalFeatures.${totem}.description`
                        )}
                    />
                </View>
            ) : null;
        }
    }, [subclass, handleChange, isOnEdit, totemOptions, totem, t]);

    if (!subclass || !(subclass in barbarianSubclasses)) return null;

    return (
        <View>
            <CustomText
                fontSize={16}
                fontWeight="bold"
                text={t(data.nameKey)}
                style={genericClassFormStyles.sectionTitle}
            />
            <CustomText text={t(data.descriptionKey)} />
            {data.features
                .filter((f) => level >= f.level)
                .map((f, idx) => (
                    <CustomText key={idx} text={`• ${t(f.descriptionKey)}`} />
                ))}

            {displaySubclassSpecifics()}
        </View>
    );
};

export default BarbarianSubclass;
