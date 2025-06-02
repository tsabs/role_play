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

interface ProficiencyOption {
    choose: number;
    desc?: string;
    desc_fr?: string;
    from: {
        options: OptionChoice[];
        option_set_type: string;
    };
    type: string;
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

// ----------------------------

interface AbilityBonus {
    bonus: number;
    ability_score: ElementIdentification;
}

// ----------------------------

interface DndBackground {
    desc: string | null;
    document__license_url: string | null;
    document__slug: string | null;
    document__title: string | null;
    document__url: string | null;
    equipment: string | null;
    feature: string | null;
    feature_desc: string | null;
    languages: string | null;
    name: string | null;
    skill_proficiencies: string | null;
    slug: string | null;
    suggested_characteristics: string | null;
    tool_proficiencies: string | null;
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
}

interface DnDConfig {
    ability: DnDAbility;
    abilities: Record<DnDAbility, number>;
    race: DndRace;
    className: DndClass;
    selectedClassElements: {
        classChoices?: Record<string, Array<{ index: string; bonus?: number }>>;
        selected_subclass?: string;
    };
    selectedRaceElements: {
        raceChoices?: Record<string, Array<{ index: string; bonus?: number }>>;
    };
    selectedBackgroundElements?: {
        backgroundChoices?: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >;
    };
    background: DndBackground;
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
    SkillProficiency,
    AbilityScores,
    DnDAbility,
    DndBackground,
    DndClass,
    DndRace,
    DndSubRace,
};
