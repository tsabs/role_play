import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ElementIdentification } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';

import { theme } from '../../../../../../style/theme';

interface SkillsDisplayProps {
    proficiencies?: ElementIdentification[];
}

const SkillDisplay = ({ proficiencies }: SkillsDisplayProps) => {
    const { t } = useTranslation();
    return (
        proficiencies?.length > 0 &&
        proficiencies?.some((proficiency) =>
            proficiency.index.includes('skill')
        ) && (
            <View
                style={{
                    flexDirection: 'row',
                    gap: theme.space.sm,
                }}
            >
                <CustomText text={'Compétences: '} />
                {proficiencies.map((proficiency, index) => {
                    if (!proficiency.index.includes('skill')) return null;
                    return (
                        <CustomText
                            key={proficiency?.index ? proficiency.index : index}
                            fontWeight="500"
                            text={t(
                                `character.skills.${
                                    proficiency.index.split('skill-')[1]
                                }.name`
                            )}
                        />
                    );
                })}
            </View>
        )
    );
};

export default SkillDisplay;
