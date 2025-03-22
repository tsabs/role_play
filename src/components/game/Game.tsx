import { Card, Text } from 'react-native-paper';
import { theme } from '../../../style/theme';

const GameCard = ({ game }) => {
    return (
        <Card
            style={{
                marginTop: theme.space.xl,
                backgroundColor: theme.colors.secondary,
            }}
            onPress={() => console.log('COOL')}
        >
            <Card.Cover
                style={{ backgroundColor: theme.colors.secondary }}
                source={game.image}
            />
            <Card.Title title={game.title} subtitle={game.gameType} />
            <Card.Content>
                <Text variant="titleSmall">{game.gameMaster}</Text>
                <Text variant="bodyMedium">nb joueurs: {game.nbPlayers}</Text>
            </Card.Content>
        </Card>
    );
};

export { GameCard };
