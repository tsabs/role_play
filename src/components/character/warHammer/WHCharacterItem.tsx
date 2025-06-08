import { View } from 'react-native';

import { WarHammerCharacter } from '../../../types/games/warHammer';

interface WHCharacterItemProps {
    character: WarHammerCharacter;
    index: number;
}

const WHCharacterItem = ({ character, index }: WHCharacterItemProps) => {
    return <View />;
};

export default WHCharacterItem;
