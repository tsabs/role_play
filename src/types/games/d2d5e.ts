import { GAME_TYPE, GenericCharacter } from '../generic';

type DnDAbility = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

type AbilityScores = {
    [key in DnDAbility]: number;
};

interface SkillProficiency {
    name: string;
    ability: DnDAbility;
    isProficient: boolean;
    isExpert: boolean;
}

interface Proficiency {
    name: string;
    type: 'skill' | 'weapon' | 'tool' | 'language' | 'saving-throw';
}

interface CharacterEquipment {
    item: ElementIdentification;
    quantity: number;
}

interface PreRequestMultiClass {
    minimum_score: number;
    ability_score: ElementIdentification;
}

// Compétences, Equipment, Spells, SavingThrow...
interface ElementIdentification {
    name: string;
    index: string;
    url?: string;
}

interface OptionChoice {
    option_type: string;
    item: ElementIdentification;
}

interface SocialChoice {
    option_type: string;
    desc: string;
    index: string;
}

interface ProficiencyOption {
    choose: number;
    desc?: string;
    desc_fr?: string;
    from: {
        options: OptionChoice[];
        option_set_type: string;
    };
    type?: string;
}

interface StartingEquipment {
    equipment: ElementIdentification;
    quantity: number;
}

interface StartingEquipmentOption {
    choose: number;
    desc: string;
    from: {
        options: OptionChoice[];
        option_set_type: string;
    };
}

interface LanguageOptions {
    choose: number;
    from: {
        options: OptionChoice[];
        option_set_type: string;
    };
    type: string;
}

interface SocialElementOptions {
    choose: number;
    from: {
        option_set_type: string;
        options: SocialChoice[];
    };
    type: string;
}

interface Spell {
    casting_time: string;
    classes: Array<ElementIdentification>;
    components: Array<string>;
    concentration: boolean;
    desc: Array<string>;
    duration: string;
    higher_level: string;
    index: string;
    level: number;
    name: string;
    ranger: string;
    ritual: boolean;
    school: ElementIdentification;
    subclasses: Array<ElementIdentification>;
    damage?: {
        damage_at_character_level: {
            1: string;
        };
        damage_at_slot_level: {
            1: string;
        };
        damage_type: { index: string; name: string };
    };
    invokableCreatures?: string[];
    updated_at: string;
}

interface Monster {
    index: string;
    name: string;
    actions?: Array<any>;
    armor_class?: Array<{ value: number; type: string }>;
    challenge_rating?: number;
    charisma: number;
    constitution: number;
    condition_immunities?: Array<ElementIdentification>;
    dexterity: number;
    intelligence: number;
    strength: number;
    wisdom: number;
    damage_immunities?: Array<string>;
    damage_resistances?: Array<string>;
    hit_dice: string;
    hit_points: number;
}

// ----------------------------

interface AbilityBonus {
    bonus: number;
    ability_score: ElementIdentification;
}

// ----------------------------

interface DndBackground {
    updated_at: string;
    bonds: SocialElementOptions;
    flaws: SocialElementOptions;
    index: string;
    name: string;
    starting_proficiencies: ElementIdentification[];
    starting_equipment: StartingEquipment[];
    starting_equipment_options?: StartingEquipmentOption[];
    feature?: {
        desc: string[];
        name: string;
    };
    tool_proficiencies?: ElementIdentification[];
    special_options?: SocialElementOptions;
    language_options?: LanguageOptions;
    personality_traits?: SocialElementOptions;
}

interface DndSubRace {
    ability_bonuses: AbilityBonus[];
    index: string;
    languages: ElementIdentification[];
    name: string;
    racial_traits: ElementIdentification[];
    starting_proficiencies: ElementIdentification[];
    updated_at: string;
    url: string;
    desc?: string;
    race?: ElementIdentification;
    alignment?: string;
    speed?: number;
    language_options?: LanguageOptions;
}

interface DndRace {
    ability_bonuses: AbilityBonus[];
    ability_bonus_options: ProficiencyOption;
    age: string;
    alignment: string;
    index: string;
    language_desc: string;
    languages: ElementIdentification[];
    name: string;
    size: string;
    size_description: string;
    speed: number;
    starting_proficiencies: ElementIdentification[];
    starting_proficiency_options: ProficiencyOption;
    subraces: ElementIdentification[];
    traits: ElementIdentification[];
    updated_at: string;
    url: string;
}

interface DndClass {
    class_levels: string;
    hit_die: number;
    index: string;
    multi_classing: {
        prerequisites: PreRequestMultiClass[];
        proficiencies: ElementIdentification[];
    };
    name: string;
    proficiencies: ElementIdentification[];
    proficiency_choices: ProficiencyOption[];
    saving_throws: ElementIdentification[];
    starting_equipment: StartingEquipment[];
    starting_equipment_options: StartingEquipmentOption[];
    subclasses: ElementIdentification[];
    updated_at: string;
    url: string;
    selectedSubClass?: string;
}

interface SelectedRaceElementsProps {
    raceChoices?: Record<string, Array<{ index: string; bonus?: number }>>;
}

interface SelectedClassElementsProps {
    classChoices?: Record<string, Array<{ index: string; bonus?: number }>>;
    selected_subclass?: string;
}

interface SpellData {
    cantrips_known: string;
    spell_slots_level_1: number;
    spell_slots_level_2: number;
    spell_slots_level_3: number;
    spell_slots_level_4: number;
    spell_slots_level_5: number;
    spell_slots_level_6: number;
    spell_slots_level_7: number;
    spell_slots_level_8: number;
    spell_slots_level_9: number;
    spells_known?: number;
}

interface SelectedSpellSpecifics {
    selectedSpells: Array<Spell>;
    selectedMinorSpells: Array<Spell>;
    spellClassData: SpellData;
}

interface DnDConfig {
    ability: DnDAbility;
    abilities: Record<DnDAbility, number>;
    race: DndRace;
    className: DndClass;
    selectedClassElements: SelectedClassElementsProps;
    selectedRaceElements: SelectedRaceElementsProps;
    selectedSpellSpecifics: SelectedSpellSpecifics;
    background: DndBackground;
    selectedBackgroundElements: {
        backgroundChoices?: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >;
    };
    gameType: GAME_TYPE.DND5E;
}

type DnDCharacter = GenericCharacter<DnDConfig>;

export {
    DnDConfig,
    DnDCharacter,
    CharacterEquipment,
    ElementIdentification,
    Proficiency,
    ProficiencyOption,
    OptionChoice,
    SocialChoice,
    SkillProficiency,
    Spell,
    SpellData,
    Monster,
    StartingEquipmentOption,
    SelectedClassElementsProps,
    SelectedRaceElementsProps,
    SelectedSpellSpecifics,
    AbilityScores,
    DnDAbility,
    DndBackground,
    DndClass,
    DndRace,
    DndSubRace,
};
