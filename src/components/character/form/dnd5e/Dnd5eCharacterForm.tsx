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
    DndBackground,
    DndClass,
    DndRace,
} from '../../../../types/games/d2d5e';
import LabeledList from './LabeledList';
import Separator from '../../../library/Separator';
import { callAddCharacter } from '../../../../store/character/slice';
import { useDispatch } from 'react-redux';
import { AuthProps, useAuth } from '../../../../navigation/hook/useAuth';

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
    // const route = useRoute();
    // const { gameType } = route.params;

    if (!auth.user) return <Fragment />;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [history, setHistory] = useState('');
    const [classes, setClasses] = useState<DndClass[] | []>([]);
    const [races, setRaces] = useState<DndRace[] | []>([]);
    const [backgrounds, setBackgrounds] = useState<DndBackground[] | []>([]);
    const [selectedClass, setSelectedClass] = useState<string>(null);
    const [selectedRace, setSelectedRace] = useState<string>(null);
    const [selectedBackground, setSelectedBackground] =
        useState<CharacterBackground>(null);

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

    const scrollViewStyle = useMemo<ViewStyle>(() => {
        return Keyboard.isVisible() || selectedBackground
            ? {
                  height: Dimensions.get('screen').height - 150,
              }
            : {};
    }, [selectedBackground]);

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
            title={'Create Your Character'}
            styles={styles(spacer).container}
        >
            <KeyboardAvoidingView
                keyboardVerticalOffset={125}
                behavior={'padding'}
            >
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
                            <Text>
                                {t(
                                    `character.backgrounds.${selectedBackground.name}.description`
                                )}
                            </Text>
                        </Animated.View>
                    )}

                    <TouchableOpacity
                        style={
                            styles(spacer, !selectedClass || !selectedRace)
                                .saveButton
                        }
                        onPress={() => {
                            callAddCharacter(
                                {
                                    id: uuidv4(),
                                    name,
                                    description,
                                    userEmail: auth.user.email,
                                    additionalBackground: history,
                                    race: selectedRace,
                                    className: selectedClass,
                                    background: selectedBackground.name,
                                    gameType: 'd2d5e',
                                },
                                dispatch
                            ).then(() => navigation.goBack());
                        }}
                        disabled={!selectedClass || !selectedRace}
                    >
                        <Text style={styles(spacer).saveButtonText}>Next</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeView>
    );
};

export default Dnd5eCharacterForm;
