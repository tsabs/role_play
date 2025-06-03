import { FC, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AbilityScores, DnDCharacter } from '../../../../types/games/d2d5e';
import {
    calculateModifier,
    getProficiencyBonus,
    mergeAbilityBonuses,
    transformRaceAbilities,
} from '../../../../utils/d2d5';
import CustomText from '../../../atom/CustomText';
import { theme } from '../../../../../style/theme';

const SKILLS: { [key: string]: keyof AbilityScores } = {
    acrobatics: 'DEX',
    'animal-handling': 'WIS',
    arcana: 'INT',
    athletics: 'STR',
    deception: 'CHA',
    history: 'INT',
    insight: 'WIS',
    intimidation: 'CHA',
    investigation: 'INT',
    medicine: 'WIS',
    nature: 'INT',
    perception: 'WIS',
    performance: 'CHA',
    persuasion: 'CHA',
    religion: 'INT',
    'sleight-of-hand': 'DEX',
    stealth: 'DEX',
    survival: 'WIS',
};

interface SkillsListProps {
    character: DnDCharacter;
    level: number;
}

const SkillsList: FC<SkillsListProps> = ({ character, level }) => {
    const { t } = useTranslation();
    const renderItem = useCallback(
        ({ item: [skill, ability] }) => {
            const transformBonuses = transformRaceAbilities(
                character?.race?.ability_bonuses || []
            );
            // console.log(transformBonuses);
            const mergeBonuses = mergeAbilityBonuses(
                character?.selectedRaceElements?.raceChoices?.[
                    `${character?.race?.index}-skills`
                ] || [],
                transformBonuses || []
            );
            const abilityBonus =
                mergeBonuses.find(
                    (aBonus) => aBonus.index === ability.toLowerCase()
                )?.bonus || 0;
            const proficientClassSkills =
                character?.selectedClassElements?.classChoices?.[
                    `${character?.className?.index}-class-0`
                ]?.some((proficientSkill) => proficientSkill?.index === skill);

            const proficientBackgroundSkills =
                character?.background?.starting_proficiencies?.some(
                    (proficiency) => {
                        const refOption = proficiency?.index?.includes('skill-')
                            ? proficiency.index.split('skill-')[1]
                            : proficiency.index;
                        return refOption === skill;
                    }
                );

            const profBonus = getProficiencyBonus(level);
            const mod =
                calculateModifier(character.abilities[ability] + abilityBonus) +
                (proficientClassSkills || proficientBackgroundSkills
                    ? profBonus
                    : 0);
            const sign = mod >= 0 ? '+' : '';
            const displayColor = () => {
                switch (mod) {
                    case 0:
                        return theme.colors.textSecondary;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        return theme.colors.success;
                    case -1:
                    case -2:
                        return theme.colors.danger;
                    default:
                        return theme.colors.textPrimary;
                }
            };
            return (
                <View key={skill} style={styles.skillRow}>
                    <CustomText
                        text={t(`character.skills.${skill}.name`)}
                        fontSize={16}
                        style={styles.skillName}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <CustomText
                            fontSize={16}
                            fontWeight="bold"
                            text={sign}
                            color={theme.colors.textSecondary}
                        />
                        <CustomText
                            fontSize={16}
                            fontWeight="bold"
                            text={`${mod}`}
                            color={displayColor()}
                        />
                    </View>
                </View>
            );
        },
        [
            level,
            character.race,
            character.selectedRaceElements,
            character.className,
            character.selectedClassElements,
            character.abilities,
        ]
    );

    return (
        <View style={styles.container}>
            <FlatList data={Object.entries(SKILLS)} renderItem={renderItem} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.space.md,
    },
    skillRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.space.sm,
        borderBottomWidth: 1,
        borderColor: theme.colors.secondary50,
    },
    skillName: {
        textTransform: 'capitalize',
        paddingBottom: theme.space.md,
    },
});

export default SkillsList;
