import { useCallback, useMemo, useState } from 'react';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import DisplaySelection from '../../atom/DisplaySelection';

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

const RangerHunter = ({
    subclass,
    selectedClassElements,
    isOnEdit,
    handleSubclassChoices,
    level,
}: RangerSubclassProps) => {
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

    if (!subclass) return null;

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
};

export default RangerHunter;
