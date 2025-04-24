import { FC } from 'react';
import { View } from 'react-native';
import { Text, Checkbox, Divider } from 'react-native-paper';
import { Ability, SkillProficiency } from '../../../../types/games/d2d5e';
import { getSkillModifier } from '../../../../utils/d2d5';

interface SkillsFormProps {
    skills: SkillProficiency[];
    abilities: Record<Ability, number>;
    level: number;
    onChange: (updatedSkills: SkillProficiency[]) => void;
}

export const SkillsForm: FC<SkillsFormProps> = ({
    skills,
    abilities,
    level,
    onChange,
}) => {
    const toggleProficiency = (index: number) => {
        const updated = [...skills];
        updated[index].isProficient = !updated[index].isProficient;
        if (!updated[index].isProficient) {
            updated[index].isExpert = false; // Remove expertise if not proficient
        }
        onChange(updated);
    };

    const toggleExpertise = (index: number) => {
        const updated = [...skills];
        if (updated[index].isProficient) {
            updated[index].isExpert = !updated[index].isExpert;
            onChange(updated);
        }
    };

    return (
        <View>
            {skills.map((skill, index) => {
                const mod = getSkillModifier(skill, abilities, level);
                const sign = mod >= 0 ? '+' : '';

                return (
                    <View key={skill.name} style={{ paddingVertical: 6 }}>
                        <Text variant="titleSmall">
                            {skill.name} ({skill.ability}) — {sign}
                            {mod}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Checkbox
                                status={
                                    skill.isProficient ? 'checked' : 'unchecked'
                                }
                                onPress={() => toggleProficiency(index)}
                            />
                            <Text>Proficient</Text>

                            <Checkbox
                                status={
                                    skill.isExpert ? 'checked' : 'unchecked'
                                }
                                onPress={() => toggleExpertise(index)}
                                disabled={!skill.isProficient}
                            />
                            <Text>Expertise</Text>
                        </View>
                        <Divider />
                    </View>
                );
            })}
        </View>
    );
};
