import { FC, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { AbilityScores, DnDCharacter } from '../../../../types/games/d2d5e';
import {
    calculateModifier,
    mergeAbilityBonuses,
    transformRaceAbilities,
} from '../../../../utils/d2d5';
import CustomText from '../../../atom/CustomText';

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
}

const SkillsList: FC<SkillsListProps> = ({ character }) => {
    const renderItem = useCallback(
        ({ item: [skill, ability], index }) => {
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
            const mod = calculateModifier(
                character.abilities[ability] + abilityBonus
            );
            const sign = mod >= 0 ? '+' : '';
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
                        />
                        <CustomText
                            fontSize={16}
                            fontWeight="bold"
                            text={`${mod}`}
                        />
                    </View>
                </View>
            );
        },
        [character.abilities]
    );

    return (
        <View style={styles.container}>
            <FlatList data={Object.entries(SKILLS)} renderItem={renderItem} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
    skillRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    skillName: {
        textTransform: 'capitalize',
    },
});

export default SkillsList;
