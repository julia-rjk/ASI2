export interface GameUserDTO {
    id?: number;
    actionPoints?: number;  
}

export default interface GameDTO {
    gameId: string;
    player1: GameUserDTO;
    player2: GameUserDTO;
    nextTurn: GameUserDTO;
}