import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomText from '../../../../../atom/CustomText';
import {
    calculateModifier,
    ExtractedProficiencies,
} from '../../../../../../utils/d2d5';
import { genericClassFormStyles } from '../genericStyle';
import { SelectedClassElementsProps } from '../../../../../../types/games/d2d5e';
import BardSubclass from '../../subclassSpecifics/BardSubclass';

interface BardTalentFormProps {
    level: number;
    abilities: Record<string, number>;
    proficienciesExtracted: ExtractedProficiencies;
    isOnEdit: boolean;
    handleSubclassChoices: (
        subclassChoices: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >
    ) => void;
    selectedClassElements?: SelectedClassElementsProps;
    subclass?: string;
}

const getInspirationDie = (level: number) => {
    if (level >= 15) return '1d12';
    if (level >= 10) return '1d10';
    if (level >= 5) return '1d8';
    return '1d6';
};

const titleTextSize = 16;

const BardTalentForm = ({
    level,
    abilities,
    proficienciesExtracted,
    isOnEdit,
    handleSubclassChoices,
    selectedClassElements,
    subclass,
}: BardTalentFormProps) => {
    const { t } = useTranslation();
    const chaMod = useMemo(
        () => calculateModifier(abilities['CHA'] || 10),
        [abilities]
    );
    const uses = useMemo(() => Math.max(chaMod, 1), [chaMod]); // At least 1 use

    const inspirationDie = useMemo(() => getInspirationDie(level), [level]);

    return (
        <View style={genericClassFormStyles.container}>
            <CustomText
                text={t(
                    'character.classes.bard.talents.bardicInspirationTitle'
                )}
                fontSize={titleTextSize}
                fontWeight="bold"
                style={genericClassFormStyles.title}
            />
            <CustomText
                text={t(
                    'character.classes.bard.talents.bardicInspirationDescription',
                    { uses }
                )}
            />
            <CustomText
                text={t('character.classes.bard.talents.inspirationDice', {
                    inspirationDie,
                    level,
                })}
            />
            <CustomText
                text={t(
                    'character.classes.bard.talents.bonusActionDescription'
                )}
            />

            {level >= 2 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleTextSize}
                        fontWeight="bold"
                        text={t(
                            'character.classes.bard.talents.songOfRestTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.bard.talents.songOfRestDescription'
                        )}
                    />
                </>
            )}

            {level >= 2 && (
                <>
                    <CustomText
                        fontSize={titleTextSize}
                        fontWeight="bold"
                        style={genericClassFormStyles.sectionTitle}
                        text={t(
                            'character.classes.bard.talents.jackOfAllTradesTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.bard.talents.jackOfAllTradesDescription'
                        )}
                    />
                </>
            )}

            {level >= 3 && (
                <BardSubclass
                    subclass={subclass}
                    proficienciesExtracted={proficienciesExtracted}
                    selectedClassElements={selectedClassElements}
                    handleSubclassChoices={handleSubclassChoices}
                    isOnEdit={isOnEdit}
                    level={level}
                />
            )}
        </View>
    );
};

export default BardTalentForm;
