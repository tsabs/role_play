import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import DisplaySelection from '../../atom/DisplaySelection';

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

const BarbarianTotem = ({
    subclass,
    selectedClassElements,
    isOnEdit,
    handleSubclassChoices,
    level,
}: BarbarianSubclassProps) => {
    const { t } = useTranslation();

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

    if (!subclass) return null;

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
};

export default BarbarianTotem;
