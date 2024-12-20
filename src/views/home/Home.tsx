import { useEffect } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, List, Text, Title } from 'react-native-paper';

import { DAND_INTRO, WARHAMMER_INTRO } from '../../../assets';
import SafeView from '../../components/SafeView';
import { theme } from '../../../style/theme';
import { gameType, RoleGame } from '../../types/roleGameTypes';
import { roleGameSlice } from '../../store/roleGame/slice';

const parties: RoleGame[] = [
    {
        id: 0,
        gameType: gameType.warHammer,
        title: 'Aventure Médiévale',
        image: DAND_INTRO,
        nbPlayers: 5,
        gameMaster: 'John Doe',
    },
    {
        id: 1,
        gameType: gameType.dungeonsAndDragons,
        title: 'Science Fiction',
        image: WARHAMMER_INTRO,
        nbPlayers: 4,
        gameMaster: 'Jane Doe',
    },
];

const GameCard = ({ game }) => {
    useEffect(() => {
        roleGameSlice.actions.setRoleGames(parties);
    }, []);

    return (
        <Card
            style={{ marginTop: theme.space.xl }}
            onPress={() => console.log('COOL')}
        >
            <Card.Cover source={game.image} />
            <Card.Title title={game.title} subtitle={game.gameType} />
            <Card.Content>
                <Text variant="titleSmall">{game.gameMaster}</Text>
                <Text variant="bodyMedium">nb joueurs: {game.nbPlayers}</Text>
            </Card.Content>
        </Card>
    );
};

const HomeScreen = () => {
    return (
        <SafeView>
            <View style={styles.title}>
                {parties.length > 0 ? (
                    <Title>Liste des campagnes en cours</Title>
                ) : (
                    <Title>Créez une campagne</Title>
                )}
            </View>
            <View>
                <Button
                    buttonColor={theme.colors.primary}
                    onPress={() => console.log('Create a new game')}
                >
                    <Text style={{ color: theme.colors.white }}>
                        Créer une nouvelle partie
                    </Text>
                </Button>
            </View>
            <Animated.FlatList
                data={parties}
                renderItem={(game) => <GameCard game={game.item} />}
                keyExtractor={(item, index) => index.toString()}
            ></Animated.FlatList>
        </SafeView>
    );
};

const styles = StyleSheet.create({
    title: {
        marginTop: theme.space.xxxl,
        alignItems: 'center',
    },
});

export default HomeScreen;
