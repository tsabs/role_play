import { SKILLS } from '@components/character/form/dnd5e/SkillsList';

//TODO need to fix the warlock problem about eldritch invocation grating proficiencies
const findInvocationsGrantingProficiency = (invocations: any[]) => {
    const skillKeys = Object.keys(SKILLS);
    // Filter and find invocations mentioning skill proficiencies
    const proficiencyInvocations = invocations.filter((invocation) => {
        if (!invocation.desc) return false;

        // Check if the description contains "skill" or any specific skill name
        const lowerDesc = invocation.desc.toLowerCase();
        return (
            lowerDesc.includes('skill') ||
            skillKeys.some((skill) =>
                lowerDesc.includes(skill.replace('-', ' '))
            )
        );
    });

    // Map to extract invocation names and descriptions
    return proficiencyInvocations.map((invocation) => {
        return {
            name: invocation.name,
            description: invocation.desc,
        };
    });
};
