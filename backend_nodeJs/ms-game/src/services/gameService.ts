import { GameUserDTO } from "../../../../client/src/entities/gameDTO";
import Game from "../models/game";
import { Server, Socket } from "socket.io";
import { CardDTO } from "../models/cardDTO";

export default class GameService {
    usersWaiting: GameUserDTO[] = []
    currentGames: Game[] = []
    finishedGames: Game[] = []

    public joinWaitingList(io: Server, socket: Socket, user: GameUserDTO) {
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
        this.startNewPlay(io, usersPlaying)
        this.usersWaiting = []
    }
    
    startNewPlay(io: Server, usersPlaying: GameUserDTO[]) {
        // Création de la partie 
        let game = new Game(usersPlaying);
        this.currentGames.push(game);

        // Avertit les utilisateurs séléctionnés, encore dans la liste d'attente, qu'ils vont jouer 
        // accompagné des informations
        io.to('waitingRoom').emit("startingPlay", game);
        console.log("Game as started in game room", game.gameId);
    }

    joinGame(socket: Socket, gameId: string) {
        socket.join(gameId);
    }

    public attack(io: Server, socket: Socket, gameId: string, attackerId: number, defenderId: number) {
        const game = this.currentGames.find(g => g.gameId === gameId) as Game;
        if (!game) {
            return;
        }
        console.log("Player " + game.nextTurn.surName + " is attacking");
        const attacker = game.player1.id === game.nextTurn.id ? game.player1.cards?.find(c => c.id === attackerId) : game.player2.cards?.find(c => c.id === attackerId) as CardDTO;
        const defender = game.player1.id === game.nextTurn.id ? game.player2.cards?.find(c => c.id === defenderId) : game.player1.cards?.find(c => c.id === defenderId) as CardDTO;
        if (!attacker|| !defender || !attacker.attack || !defender.defence || !defender.hp || !attacker.energy) {
            return;
        }
        // compute random damage with attacker attack and defender defense
        const damage = attacker.attack - Math.random() * defender.defence;
        if (damage > 0) {
            defender.hp -= damage;
        }
        // remove life from defender
        defender.hp = defender.hp - damage;
        if (defender.hp <= 0) {
            defender.hp = 0;
        }
        // remove energy from attacker
        attacker.energy = attacker.energy - 1;
        if (attacker.energy <= 0) {
            attacker.energy = 0;
        }
        // change turn
        game.nextTurn = game.player1.id === game.nextTurn.id ? game.player2 : game.player1;
        
        // send update to players
        // io.to(game.gameId).emit("updateGame", game);
        io.to(game.gameId).emit("updateGame", game);
    }
}