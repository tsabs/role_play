import { Fragment, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomSelectionButton from '@components/atom/CustomSelectionButton';
import CustomText from '@components/atom/CustomText';

import {
    combatsStyle,
    favoredEnemyData,
    favoredTerrainData,
} from '../classSpecifics/ranger/rangerClass';
import { theme } from '../../../../../../style/theme';
import { totemAnimalData } from '@components/character/form/dnd5e/subclassSpecifics/barbarian/barbarianSubclasses.ts';
import { huntersPrey } from '@components/character/form/dnd5e/subclassSpecifics/ranger/rangerSubclasses.ts';

interface DisplaySelectionProps {
    isOnEdit: boolean;
    className: string;
    handleChange: (val: string, selected: string) => void;
    type: string;
    subclass?: string;
    selectedValue?: string;
}

const DisplaySelection = ({
    isOnEdit,
    className,
    handleChange,
    type,
    subclass,
    selectedValue,
}: DisplaySelectionProps) => {
    const { t } = useTranslation();

    const favoredOptions = useMemo(() => {
        switch (type) {
            // Barbarian start
            case 'spiritAnimalFeatures':
                return totemAnimalData?.map((totem) => ({
                    label: t(totem.label),
                    value: totem.value,
                }));
            // Barbarian end

            // Ranger start
            case 'favoredEnemies':
                return favoredEnemyData?.map((enemy) => ({
                    label: t(enemy.label),
                    value: enemy.value,
                }));
            case 'favoredTerrains':
                return favoredTerrainData?.map((enemy) => ({
                    label: t(enemy.label),
                    value: enemy.value,
                }));
            case 'combatsStyle':
                return combatsStyle.map((combat) => ({
                    label: t(combat.label),
                    value: combat.value,
                }));
            case 'huntersPrey':
                return huntersPrey.map((prey) => ({
                    label: t(prey.label),
                    value: prey.value,
                }));
            // Ranger end
            default:
                return [];
        }
    }, [t, type]);

    const label = subclass
        ? t(
              `character.classes.${className}.subclasses.${subclass}.${type}.${selectedValue}.index`
          )
        : t(`character.classes.${className}.${type}.${selectedValue}.index`);

    const description = subclass
        ? t(
              `character.classes.${className}.subclasses.${subclass}.${type}.${selectedValue}.description`
          )
        : t(
              `character.classes.${className}.${type}.${selectedValue}.description`
          );

    return (
        <Fragment>
            {isOnEdit ? (
                <CustomSelectionButton
                    customStyle={{
                        borderWidth: 1,
                        backgroundColor: theme.colors.light,
                        borderRadius: theme.radius.sm,
                        borderColor: theme.colors.primary,
                        marginTop: theme.space.md,
                    }}
                    preSelectedValue={
                        selectedValue
                            ? {
                                  label,
                                  value: selectedValue,
                              }
                            : undefined
                    }
                    displayValue={selectedValue ? label : ''}
                    placeHolder="Choisir..."
                    items={favoredOptions}
                    onSelect={(val) => handleChange(val, type)}
                />
            ) : null}
            {selectedValue && (
                <View>
                    <CustomText fontWeight="bold" text={label} />
                    <CustomText text={description} />
                </View>
            )}
        </Fragment>
    );
};

export default DisplaySelection;
