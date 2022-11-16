import { UserDTO } from "../../../client/src/entities/userDTO";
import * as uuid from 'uuid';
import Game from "../models/game";
import { Server, Socket } from "socket.io";

export default class GameService {
    usersWaiting: UserDTO[] = []
    currentGames:Game[] = []
    finishedGames:Game[] = []

    public joinWaitingList(io:Server, socket: Socket, user: UserDTO) {
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
        this.startNewPlay(io,socket,usersPlaying)
        this.usersWaiting = []
    }
    startNewPlay(io:Server, socket: Socket, usersPlaying: UserDTO[]) {
        // Création de la partie 
        let game = new Game(usersPlaying);
        this.currentGames.push(game);

        // Avertit les utilisateurs séléctionnés, encore dans la liste d'attente, qu'ils vont jouer 
        // accompagné des informations 
        io.to('waitingRoom').emit("startingPlay", game);
        console.log("Game as started in game room", game.gameId);
    }
}