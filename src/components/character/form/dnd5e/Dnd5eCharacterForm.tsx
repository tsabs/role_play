import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import {
    getBackgrounds,
    getClasses,
    getRaces,
    getSkills,
} from '../../../../store/character/dnd5e/services';
import SafeView from '../../../library/SafeView';
import { styles } from './characterFormStyles';
import { theme } from '../../../../../style/theme';
import {
    DnDAbility,
    DndBackground,
    DndClass,
    DndRace,
    ElementIdentification,
} from '../../../../types/games/d2d5e';
import LabeledList from './LabeledList';
import Separator from '../../../library/Separator';
import { callAddCharacter } from '../../../../store/character/slice';
import { useDispatch } from 'react-redux';
import { AuthProps, useAuth } from '../../../../navigation/hook/useAuth';
import AbilityForm from '../generic/AbilityForm';
import { ABILITIES } from './constants';
import { Ability, GAME_TYPE } from '../../../../types/generic';
import CustomSelectionButton from '../../../atom/CustomSelectionButton';
import {
    maxLevels,
    mergeAbilityBonuses,
    remainingPoints,
    transformRaceAbilities,
} from '../../../../utils/d2d5';
import ProficiencySelector from './proficiencies/ProficiencySelector';
import VirtualizedScrollView from '../../../library/VirtualizedScrollView';
import TalentClassForm from './TalentClassForm';
import CustomButton from '../../../atom/CustomButton';

interface Dnd5eCharacterFormProps {
    gameType: string;
}

const spacer = 20;

interface CharacterBackground {
    name: string;
    description: string;
}

const Dnd5eCharacterForm = ({ gameType }: Dnd5eCharacterFormProps) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const auth: AuthProps = useAuth();

    if (!auth.user) return <Fragment />;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [history, setHistory] = useState('');
    const [classes, setClasses] = useState<DndClass[] | []>([]);
    const [races, setRaces] = useState<DndRace[] | []>([]);
    const [selectedAbility, setSelectedAbility] =
        useState<Record<DnDAbility, number>>(ABILITIES);
    const [backgrounds, setBackgrounds] = useState<DndBackground[] | []>([]);
    const [selectedClass, setSelectedClass] = useState<string>(null);
    const [selectProficiencies, setSelectProficiencies] = useState<
        Record<string, { index: string; bonus?: number }[]>
    >({});
    const [raceSelectionOptions, setRaceSelectionOptions] = useState<
        Record<string, { index: string; bonus?: number }[]>
    >({});
    const [selectedRace, setSelectedRace] = useState<string>(null);
    const [selectedBackground, setSelectedBackground] =
        useState<CharacterBackground>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [level, setLevel] = useState(1);

    const callGetBackgrounds = useCallback(async () => {
        const resultBackgrounds = (await getBackgrounds().catch((err) =>
            console.log(err)
        )) as DndBackground[] | void;
        if (!resultBackgrounds) return [];
        setBackgrounds(resultBackgrounds);
    }, []);
    const callGetRaces = useCallback(async () => {
        const resultRaces = (await getRaces().catch((err) =>
            console.log(err)
        )) as DndRace[] | void;
        if (!resultRaces) return [];
        setRaces(resultRaces);
    }, []);

    const callGetClasses = useCallback(async () => {
        const resultClasses = (await getClasses().catch((err) =>
            console.log(err)
        )) as DndClass[] | void;
        if (!resultClasses) return [];
        setClasses(resultClasses);
    }, []);

    const callGetSkills = async () => {
        // console.log('skills');
        await getSkills().then(
            (res) =>
                // console.log(res.map((skill) => skill.index))
                res
        );
    };

    const handleGroupClassSelectionChange = useCallback(
        (
            groupId: string,
            selectedIndexes: { index: string; bonus?: number }[]
        ) => {
            setSelectProficiencies((prev) => ({
                ...prev,
                [groupId]: selectedIndexes,
            }));
        },
        []
    );

    const handleGroupRaceSelectionChange = useCallback(
        (
            groupId: string,
            selectedIndexes: { index: string; bonus?: number }[]
        ) => {
            setRaceSelectionOptions((prev) => {
                return {
                    ...prev,
                    [groupId]: selectedIndexes,
                };
            });
        },
        []
    );

    useEffect(() => {
        Promise.all([
            callGetBackgrounds(),
            callGetClasses(),
            callGetRaces(),
            callGetSkills(),
        ]);
    }, [gameType]);
    useEffect(() => {
        const listenerKeyBoardDidShow = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsKeyboardVisible(true);
                console.log('is visible');
            }
        );
        return () => listenerKeyBoardDidShow.remove();
    }, []);
    useEffect(() => {
        const listenerKeyBoardDidShow = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsKeyboardVisible(false);
            }
        );
        return () => listenerKeyBoardDidShow.remove();
    }, []);

    const scrollViewStyle = useMemo<ViewStyle>(() => {
        if (isKeyboardVisible) {
            return {
                height: Dimensions.get('window').height - 400,
            };
        }
        if (selectedBackground) {
            return {
                height: Dimensions.get('window').height - 150,
            };
        }
        return {
            height: Dimensions.get('window').height - 150,
        };
    }, [isKeyboardVisible, Keyboard.isVisible(), selectedBackground]);

    const textDisplay: Array<{
        label: string;
        value: string;
        setValue: (value: string) => void;
    }> = [
        { label: 'Nom', value: name, setValue: setName },
        { label: 'Description', value: description, setValue: setDescription },
        { label: 'Histoire', value: history, setValue: setHistory },
    ];

    // console.log(
    //     'selectedClass',
    //     classes.find((item: DndClass) => item.index === selectedClass)
    // );
    //
    // console.log(
    //     'selectedRace',
    //     races?.find((race: DndRace) => race.index === selectedRace)
    // );

    // console.log('selectProficiencies', selectProficiencies);
    // console.log('selectRaceProficiencies', raceSelectionOptions);

    const selectedObjectClass = useMemo(
        () => classes?.find((item: DndClass) => item?.index === selectedClass),
        [classes, selectedClass]
    );

    const selectedObjectRace = useMemo(
        () => races?.find((item: DndRace) => item?.index === selectedRace),
        [races, selectedRace]
    );

    // console.log('select proficiencies : ', selectProficiencies);
    // console.log('race proficiencies : ', raceSelectionOptions);

    const selectedClassElements = useMemo(() => {
        return {
            classChoices: selectProficiencies,
            selected_subclass: '',
        };
    }, [selectProficiencies]);
    const selectedRaceElements = useMemo(() => {
        return {
            raceChoices: raceSelectionOptions,
        };
    }, [raceSelectionOptions]);

    // console.log('selected race proficiencies : ', selectedRaceElements);

    const transformedAbilities = useMemo(
        () => transformRaceAbilities(selectedObjectRace?.ability_bonuses || []),
        [selectedObjectRace?.ability_bonuses]
    );

    const mergeAbilities = useMemo(
        () =>
            mergeAbilityBonuses(
                selectedRaceElements?.raceChoices?.[`${selectedRace}-skills`] ||
                    [],
                transformedAbilities || []
            ),
        [selectedRaceElements?.raceChoices, transformedAbilities]
    );

    // console.log('backgrounds: ', backgrounds);

    const isSaveCharacterDisabled = useMemo(
        () =>
            !selectedClass ||
            !selectedRace ||
            !selectedBackground ||
            remainingPoints(selectedAbility) < 0,
        [
            selectedClass,
            selectedRace,
            selectedBackground,
            remainingPoints,
            selectedAbility,
        ]
    );

    // console.log(totalCost);

    return (
        <SafeView
            title={'Créez votre personnage'}
            styles={styles(spacer, isKeyboardVisible).container}
        >
            <KeyboardAvoidingView behavior={'padding'} enabled>
                <VirtualizedScrollView style={scrollViewStyle}>
                    <CustomSelectionButton
                        items={maxLevels}
                        placeHolder={'Choisissez un niveau'}
                        onSelect={(value) => setLevel(value)}
                        preSelectedValue={{
                            label: level.toString(),
                            value: level,
                        }}
                    />
                    {textDisplay.map(({ label, value, setValue }, index) => {
                        return (
                            <Fragment key={`${label}-${index}`}>
                                <TextInput
                                    mode="outlined"
                                    multiline={true}
                                    numberOfLines={10}
                                    label={label}
                                    value={value}
                                    onChangeText={setValue}
                                    activeOutlineColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    style={{
                                        marginVertical: theme.space.l,
                                    }}
                                />
                                <Separator horizontal />
                            </Fragment>
                        );
                    })}
                    <LabeledList
                        name="Races"
                        values={races}
                        setSelectedValue={setSelectedRace}
                        selectedName={selectedRace}
                    />
                    {selectedObjectRace?.starting_proficiency_options?.from
                        ?.options && (
                        <ProficiencySelector
                            key={`${selectedObjectRace.index}-race-proficiencies`}
                            data={
                                selectedObjectRace?.starting_proficiency_options
                            }
                            groupId={`${selectedObjectRace.index}-race-proficiencies`}
                            onChange={handleGroupRaceSelectionChange}
                        />
                    )}
                    {selectedObjectRace?.ability_bonus_options && (
                        <ProficiencySelector
                            key={`${selectedObjectRace.index}-skills`}
                            data={selectedObjectRace.ability_bonus_options}
                            groupId={`${selectedObjectRace.index}-skills`}
                            onChange={handleGroupRaceSelectionChange}
                        />
                    )}

                    <LabeledList
                        name="Classes"
                        values={classes}
                        setSelectedValue={setSelectedClass}
                        selectedName={selectedClass}
                    />
                    {selectedObjectClass?.proficiency_choices?.length > 0 &&
                        selectedObjectClass.proficiency_choices.map(
                            (item, index) => {
                                return (
                                    <ProficiencySelector
                                        key={`${selectedObjectClass.index}-class-${index}`}
                                        data={item}
                                        groupId={`${selectedObjectClass.index}-class-${index}`}
                                        onChange={
                                            handleGroupClassSelectionChange
                                        }
                                    />
                                );
                            }
                        )}
                    {selectedObjectClass && (
                        <TalentClassForm
                            abilities={selectedAbility}
                            level={level}
                            characterClass={selectedObjectClass.index}
                        />
                    )}
                    <LabeledList
                        name="Backgrounds"
                        values={backgrounds}
                        setSelectedValue={setSelectedBackground}
                        selectedName={selectedBackground?.name}
                        itemsPerColumn={4}
                    />

                    {selectedObjectRace?.index &&
                        selectedObjectClass?.index && (
                            <AbilityForm
                                abilities={
                                    selectedAbility as Record<Ability, number>
                                }
                                abilityBonuses={mergeAbilities}
                                isEditMode={true}
                                remainingPoints={remainingPoints(
                                    selectedAbility
                                )}
                                onChange={setSelectedAbility}
                            />
                        )}

                    <CustomButton
                        style={
                            styles(
                                spacer,
                                !selectedClass || !selectedRace,
                                isSaveCharacterDisabled
                            ).saveButton
                        }
                        text={'Sauvegarder'}
                        onPress={() => {
                            console.log('add characetr');
                            callAddCharacter(
                                {
                                    id: uuidv4(),
                                    name,
                                    description,
                                    userEmail: auth.user.email,
                                    additionalBackground: history,
                                    race: races?.find(
                                        (race: DndRace) =>
                                            race.index === selectedRace
                                    ),
                                    selectedRaceElements: selectedRaceElements,
                                    level,
                                    abilities: selectedAbility,
                                    className: classes?.find(
                                        (dndClass: DndClass) =>
                                            dndClass.index === selectedClass
                                    ),
                                    selectedClassElements:
                                        selectedClassElements,
                                    background: backgrounds?.find(
                                        (dndBackground: DndBackground) =>
                                            dndBackground.slug ===
                                            selectedBackground?.name
                                    ),
                                    gameType: GAME_TYPE.DND5E,
                                },
                                dispatch
                            )
                                .then(() => navigation.goBack())
                                .catch((err) => console.log(err));
                        }}
                        disabled={
                            !selectedClass ||
                            !selectedRace ||
                            !selectedBackground ||
                            remainingPoints(selectedAbility) < 0
                        }
                    />
                </VirtualizedScrollView>
            </KeyboardAvoidingView>
        </SafeView>
    );
};

export default Dnd5eCharacterForm;
