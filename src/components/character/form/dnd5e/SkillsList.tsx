import { FC, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

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
    const renderItem = useCallback(
        ({ item: [skill, ability] }) => {
            const transformBonuses = transformRaceAbilities(
                character?.race?.ability_bonuses || []
            );
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
            const proficientSkills =
                character?.selectedClassElements?.classChoices?.[
                    `${character?.className?.index}-class-0`
                ]?.some((proficientSkill) => proficientSkill?.index === skill);

            const profBonus = getProficiencyBonus(level);
            const mod =
                calculateModifier(character.abilities[ability] + abilityBonus) +
                (proficientSkills ? profBonus : 0);
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
                        text={skill.replace(/-/g, ' ')}
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
