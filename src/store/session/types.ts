import { Note } from 'types/note';

enum gameType {
    dungeonsAndDragons = 'Dungeons and Dragons',
    warHammer = 'Warhammer',
}

type Session = {
    id: string;
    gameMasterName?: string;
    gmId: string; // Game Master ID
    name: string;
    notes: Note[];
    playerCharacterIds: string[];
    invitedPlayerIds: string[];
    gameType?: string;
    gameImgPath?: string;
    createdAt: number;
};

interface SessionsState {
    sessions: Session[];
}

export { SessionsState, Session, gameType };
