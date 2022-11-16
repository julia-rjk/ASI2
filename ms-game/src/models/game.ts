import * as uuid from 'uuid';
import { UserDTO } from "../../../client/src/entities/userDTO";

export default class Game {
    gameId!: string;
    player1!: UserDTO;
    player2!: UserDTO;
    nextTurn!: UserDTO;

    constructor(players: UserDTO[]) {
        this.gameId = uuid.v4();
        this.player1 = players[0];
        this.player2 = players[1];
        // On choisit aléatoirement le premier joueur
        this.nextTurn = Math.random() < 0.5 ? this.player1 : this.player2;
    }
}