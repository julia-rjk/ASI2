import { GameUserDTO } from "../../../client/src/entities/gameDTO";
import Game from "../models/game";
import { Server, Socket } from "socket.io";

export default class GameService {
    usersWaiting: GameUserDTO[] = []
    currentGames:Game[] = []
    finishedGames:Game[] = []

    public joinWaitingList(io:Server, socket: Socket, user: GameUserDTO) {
        socket.join("waitingRoom");
        console.log('User', user.id, "joinded waiting list");
        user.actionPoints = 100;
        this.usersWaiting.push(user);


        // S'il n'y a pas 2 utilisateurs en attente
        if (this.usersWaiting.length < 2) {
            return;
        }

        // On sélectionne les 2 joueurs de la liste, on lance un nouveau jeu et on vide la liste d'attente
        let usersPlaying = [this.usersWaiting[0], this.usersWaiting[1]]
        this.startNewPlay(io,usersPlaying)
        this.usersWaiting = []
    }
    startNewPlay(io:Server, usersPlaying: GameUserDTO[]) {
        // Création de la partie 
        let game = new Game(usersPlaying);
        this.currentGames.push(game);

        // Avertit les utilisateurs séléctionnés, encore dans la liste d'attente, qu'ils vont jouer 
        // accompagné des informations 
        io.to('waitingRoom').emit("startingPlay", game);
        console.log("Game as started in game room", game.gameId);
    }
}