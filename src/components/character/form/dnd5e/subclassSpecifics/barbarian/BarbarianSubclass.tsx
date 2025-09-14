import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';

import { genericClassFormStyles } from '../../genericStyle';
import DisplaySelection from '../../atom/DisplaySelection.tsx';

import { barbarianSubclasses } from './barbarianSubclasses';

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

    const handleChange = useCallback(
        (value: string) => {
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
            return (
                <DisplaySelection
                    isOnEdit={isOnEdit}
                    className={'barbarian'}
                    handleChange={handleChange}
                    type={'spiritAnimalFeatures'}
                    subclass={subclass}
                    selectedValue={totem}
                />
            );
        }
    }, [subclass, handleChange, totem, isOnEdit]);

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
