import { Text } from 'react-native-paper';
import SafeView from '../../../library/SafeView';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    Dimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInLeft, SlideInLeft } from 'react-native-reanimated';
import {
    getBackgrounds,
    getClasses,
    getRaces,
} from '../../../../store/character/dnd5e/services';
import { styles } from './characterFormStyles';
import { theme } from '../../../../../style/theme';

interface Dnd5eCharacterFormProps {
    gameType: string;
}

const spacer = 20;

interface CharacterBackground {
    name: string;
    description: string;
}

const Dnd5eCharacterForm = ({ gameType }: Dnd5eCharacterFormProps) => {
    const navigation = useNavigation();
    // const route = useRoute();
    // const { gameType } = route.params;

    const [classes, setClasses] = useState([]);
    const [races, setRaces] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedRace, setSelectedRace] = useState(null);
    const [selectedBackgrounds, setSelectedBackgrounds] =
        useState<CharacterBackground>(null);

    const callGetBackgrounds = useCallback(async () => {
        const backgrounds = await getBackgrounds().catch((err) =>
            console.log(err)
        );
        if (!backgrounds) return [];
        setBackgrounds(backgrounds);
    }, []);
    const callGetRaces = useCallback(async () => {
        const races = await getRaces().catch((err) => console.log(err));
        if (!races) return [];
        setRaces(races);
    }, []);

    const callGetClasses = useCallback(async () => {
        const classes = await getClasses().catch((err) => console.log(err));
        if (!classes) return [];
        setClasses(classes);
    }, []);

    useEffect(() => {
        Promise.all([callGetBackgrounds(), callGetClasses(), callGetRaces()]);
    }, [gameType]);

    return (
        <SafeView
            title={'Create Your Character'}
            styles={styles(spacer).container}
        >
            <ScrollView
                style={{ height: Dimensions.get('screen').height - 150 }}
            >
                <View style={styles(spacer).selectedValue}>
                    <Text
                        variant={'titleMedium'}
                        style={styles(spacer).subTitle}
                    >
                        Select Race:
                    </Text>

                    {selectedRace && (
                        <Text style={styles(spacer).subText}>
                            {selectedRace}
                        </Text>
                    )}
                </View>
                <FlatList
                    data={races}
                    keyExtractor={(item) => item.index}
                    horizontal
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInLeft.delay(index * 100)}>
                            <TouchableOpacity
                                style={[
                                    styles(spacer).choiceButton,
                                    selectedRace === item.index &&
                                        styles(spacer).selected,
                                ]}
                                onPress={() => setSelectedRace(item.index)}
                            >
                                <Text style={styles(spacer).choiceText}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                />

                <View style={styles(spacer).selectedValue}>
                    <Text
                        variant={'titleMedium'}
                        style={styles(spacer).subTitle}
                    >
                        Select Class:
                    </Text>

                    {selectedClass && (
                        <Text style={styles(spacer).subText}>
                            {selectedClass}
                        </Text>
                    )}
                </View>

                <FlatList
                    data={classes}
                    keyExtractor={(item) => item.index}
                    horizontal
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInLeft.delay(index * 100)}>
                            <TouchableOpacity
                                style={[
                                    styles(spacer).choiceButton,
                                    selectedClass === item.index &&
                                        styles(spacer).selected,
                                ]}
                                onPress={() => setSelectedClass(item.index)}
                            >
                                <Text style={styles(spacer).choiceText}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                />

                <View style={styles(spacer).selectedValue}>
                    <Text
                        variant={'titleMedium'}
                        style={styles(spacer).subTitle}
                    >
                        Select Backgrounds:
                    </Text>

                    {selectedBackgrounds?.name && (
                        <Text style={styles(spacer).subText}>
                            {selectedBackgrounds.name}
                        </Text>
                    )}
                </View>
                <FlatList
                    data={backgrounds}
                    keyExtractor={(item) => item.slug}
                    horizontal
                    renderItem={({ item, index }) => (
                        <Animated.View
                            style={{ flexDirection: 'column' }}
                            entering={FadeInLeft.delay(index * 100)}
                        >
                            <TouchableOpacity
                                style={[
                                    styles(spacer).choiceButton,
                                    selectedBackgrounds?.name === item.slug &&
                                        styles(spacer).selected,
                                ]}
                                onPress={() =>
                                    setSelectedBackgrounds({
                                        name: item.slug,
                                        description: item.desc,
                                    })
                                }
                            >
                                <Text style={styles(spacer).choiceText}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                />

                {selectedBackgrounds?.description && (
                    <Animated.View
                        key={selectedBackgrounds.name}
                        style={{ padding: theme.space.md }}
                        entering={SlideInLeft.delay(100)}
                    >
                        <Text>{selectedBackgrounds.description}</Text>
                    </Animated.View>
                )}

                <TouchableOpacity
                    style={
                        styles(spacer, !selectedClass || !selectedRace)
                            .nextButton
                    }
                    onPress={() =>
                        // navigation.navigate('SpellSelection', {
                        //     gameType,
                        //     selectedRace,
                        //     selectedClass,
                        // })
                        console.log('spell selection')
                    }
                    disabled={!selectedClass || !selectedRace}
                >
                    <Text style={styles(spacer).nextButtonText}>Next</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeView>
    );
};

export default Dnd5eCharacterForm;
