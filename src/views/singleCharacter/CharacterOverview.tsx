import { Dimensions, ImageBackground } from 'react-native';
import { Text } from 'react-native-paper';

import SafeView from '../../components/library/SafeView';
import { GenericCharacter } from '../../store/character/slice';
import { DND_CHARACTER_DEFAULT } from '../../../assets';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CharacterOverviewProps {
    character: GenericCharacter;
}

const { height, width } = Dimensions.get('screen');

const CharacterOverview = ({ character }: CharacterOverviewProps) => {
    return (
        <SafeView parentStyles={{ padding: 0 }} title={character.name}>
            <Animated.View entering={FadeIn.duration(750).delay(100)}>
                <ImageBackground
                    source={DND_CHARACTER_DEFAULT}
                    style={{ width, height: height / 2 }}
                />
            </Animated.View>
            <Text>Hello world</Text>
        </SafeView>
    );
};

export default CharacterOverview;
