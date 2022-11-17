import * as uuid from 'uuid';
import { GameUserDTO } from "../../../client/src/entities/gameDTO";

export default class Game {
    gameId: string;
    player1: GameUserDTO;
    player2: GameUserDTO;
    nextTurn: GameUserDTO;

    constructor(players: GameUserDTO[]) {
        this.gameId = uuid.v4();
        this.player1 = players[0];
        this.player2 = players[1];
        // On choisit aléatoirement le premier joueur
        this.nextTurn = Math.random() < 0.5 ? this.player1 : this.player2;
    }
}