enum gameType {
    dungeonsAndDragons = 'Dungeons and Dragons',
    warHammer = 'Warhammer',
}

interface RoleGame {
    id: number;
    title: string;
    nbPlayers?: number;
    gameMaster: string;
    image: string;
    gameType: string;
}

interface RoleGamesState {
    roleGamesState: RoleGame[];
}

export { RoleGamesState, RoleGame, gameType };
