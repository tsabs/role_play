import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';

import DisplaySelection from '../../atom/DisplaySelection.tsx';
import { genericClassFormStyles } from '../../genericStyle';

import { rangerSubclasses } from './rangerSubclasses';

interface RangerSubclassProps {
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

const RangerSubclass = ({
    subclass,
    selectedClassElements,
    isOnEdit,
    handleSubclassChoices,
    level,
}: RangerSubclassProps) => {
    const { t } = useTranslation();

    const data = rangerSubclasses[subclass as keyof typeof rangerSubclasses];

    const selectedHuntersPrey = useMemo(
        () => selectedClassElements?.classChoices?.['hunters-prey']?.[0]?.index,
        [selectedClassElements?.classChoices]
    );

    const [prey, setPreyPrey] = useState(selectedHuntersPrey);

    const handleChange = useCallback(
        (value: string) => {
            setPreyPrey(value);
            handleSubclassChoices({
                ...selectedClassElements.classChoices,
                ['hunters-prey']: [{ index: value }],
            });
        },
        [selectedClassElements, handleSubclassChoices]
    );

    const displaySubClassSpecifics = useCallback(() => {
        if (subclass === 'hunter') {
            return (
                <DisplaySelection
                    isOnEdit={isOnEdit}
                    className={'ranger'}
                    subclass={subclass}
                    handleChange={handleChange}
                    type="huntersPrey"
                    selectedValue={prey}
                />
            );
        }
    }, [handleChange, isOnEdit, prey, subclass]);

    if (!subclass || !(subclass in rangerSubclasses)) return null;

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
            {displaySubClassSpecifics()}
        </View>
    );
};

export default RangerSubclass;
