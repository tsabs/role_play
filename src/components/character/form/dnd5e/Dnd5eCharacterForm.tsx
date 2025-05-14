import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput } from 'react-native-paper';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import {
    getBackgrounds,
    getClasses,
    getRaces,
} from '../../../../store/character/dnd5e/services';
import SafeView from '../../../library/SafeView';
import { styles } from './characterFormStyles';
import { theme } from '../../../../../style/theme';
import {
    DnDAbility,
    DndBackground,
    DndClass,
    DndRace,
} from '../../../../types/games/d2d5e';
import LabeledList from './LabeledList';
import Separator from '../../../library/Separator';
import { callAddCharacter } from '../../../../store/character/slice';
import { useDispatch } from 'react-redux';
import { AuthProps, useAuth } from '../../../../navigation/hook/useAuth';
import CustomText from '../../../atom/CustomText';
import AbilityForm from '../generic/AbilityForm';
import { ABILITIES } from './constants';
import { Ability, GAME_TYPE } from '../../../../types/generic';
import CustomSelectionButton from '../../../atom/CustomSelectionButton';
import { maxLevels } from '../../../../utils/d2d5';

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
    const [selectedRace, setSelectedRace] = useState<string>(null);
    const [selectedBackground, setSelectedBackground] =
        useState<CharacterBackground>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [level, setLevel] = useState(1);

    const callGetBackgrounds = useCallback(async () => {
        const backgrounds = (await getBackgrounds().catch((err) =>
            console.log(err)
        )) as DndBackground[] | void;
        if (!backgrounds) return [];
        setBackgrounds(backgrounds);
    }, []);
    const callGetRaces = useCallback(async () => {
        const races = (await getRaces().catch((err) => console.log(err))) as
            | DndRace[]
            | void;
        if (!races) return [];
        setRaces(races);
    }, []);

    const callGetClasses = useCallback(async () => {
        const classes = (await getClasses().catch((err) =>
            console.log(err)
        )) as DndClass[] | void;
        if (!classes) return [];
        setClasses(classes);
    }, []);

    useEffect(() => {
        Promise.all([callGetBackgrounds(), callGetClasses(), callGetRaces()]);
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
            height: Dimensions.get('window').height - 50,
        };
    }, [isKeyboardVisible, Keyboard.isVisible(), selectedBackground]);

    const textDisplay: Array<{
        label: string;
        value: string;
        setValue: (value: string) => void;
    }> = [
        { label: 'Name', value: name, setValue: setName },
        { label: 'Description', value: description, setValue: setDescription },
        { label: 'History', value: history, setValue: setHistory },
    ];

    return (
        <SafeView
            title={'Créez votre personnage'}
            styles={styles(spacer, isKeyboardVisible).container}
        >
            <KeyboardAvoidingView behavior={'padding'} enabled>
                <CustomSelectionButton
                    items={maxLevels}
                    placeHolder={'Choisissez un niveau'}
                    onSelect={(value) => setLevel(value)}
                />
                <ScrollView style={scrollViewStyle}>
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
                                    style={{ marginVertical: theme.space.l }}
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
                    <LabeledList
                        name="Classes"
                        values={classes}
                        setSelectedValue={setSelectedClass}
                        selectedName={selectedClass}
                    />
                    <LabeledList
                        name="Backgrounds"
                        values={backgrounds}
                        setSelectedValue={setSelectedBackground}
                        selectedName={selectedBackground?.name}
                    />
                    {selectedBackground?.name && (
                        <Animated.View
                            key={selectedBackground.name}
                            style={{ padding: theme.space.md }}
                            entering={SlideInLeft.delay(100)}
                        >
                            <CustomText
                                text={t(
                                    `character.backgrounds.${selectedBackground.name}.description`
                                )}
                            />
                        </Animated.View>
                    )}

                    <AbilityForm
                        abilities={selectedAbility as Record<Ability, number>}
                        isEditMode={true}
                        onChange={setSelectedAbility}
                    />

                    <TouchableOpacity
                        style={
                            styles(spacer, !selectedClass || !selectedRace)
                                .saveButton
                        }
                        onPress={() => {
                            console.log('selected ability', selectedAbility);
                            callAddCharacter(
                                {
                                    id: uuidv4(),
                                    name,
                                    description,
                                    userEmail: auth.user.email,
                                    additionalBackground: history,
                                    race: selectedRace,
                                    level,
                                    abilities: selectedAbility,
                                    className: selectedClass,
                                    background: selectedBackground.name,
                                    gameType: GAME_TYPE.DND5E,
                                },
                                dispatch
                            ).then(() => navigation.goBack());
                        }}
                        disabled={!selectedClass || !selectedRace}
                    >
                        <Text style={styles(spacer).saveButtonText}>Next</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/*{<Separator margin={300} />}*/}
            </KeyboardAvoidingView>
        </SafeView>
    );
};

export default Dnd5eCharacterForm;
