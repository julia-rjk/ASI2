import GameDTO, { GameUserDTO } from "../../../../client/src/entities/gameDTO";
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
        user.actionPoints = 2;
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
    
    public startNewPlay(io: Server, usersPlaying: GameUserDTO[]) {
        // Création de la partie 
        let game = new Game(usersPlaying);
        this.currentGames.push(game);

        // Avertit les utilisateurs séléctionnés, encore dans la liste d'attente, qu'ils vont jouer 
        io.to('waitingRoom').emit("startingPlay", game);
        console.log("Game as started in game room", game.gameId);
    }

    public joinGame(socket: Socket, gameId: string) {
        socket.join(gameId);
    }

    public attack(io: Server, socket: Socket, gameId: string, cardAttackerId: number, cardDefenderId: number) {
        // get game
        const game = this.currentGames.find(g => g.gameId === gameId);
        if (!game || !cardAttackerId || !cardDefenderId) {
            return;
        }
        console.log("Player " + game.nextTurn.surName + " is attacking");

        // get players
        const attacker = game.player1.id === game.nextTurn.id ? game.player1 : game.player2 as GameUserDTO;
        const defender = game.player1.id === game.nextTurn.id ? game.player2 : game.player1 as GameUserDTO;
        if(!attacker || !defender || !attacker.cards || !defender.cards || !attacker.actionPoints || attacker.actionPoints == 0) {
            return;
        }

        // get cards
        const cardAttacker = attacker.cards.find(c => c.id === cardAttackerId) as CardDTO;
        const cardDefender = defender.cards.find(c => c.id === cardDefenderId) as CardDTO;        
        if (!cardAttacker|| !cardDefender || cardAttacker.energy < 1 || cardDefender.hp < 1 || cardAttacker.hp < 1) {
            return;
        }

        // remove action point
        attacker.actionPoints = attacker.actionPoints - 1;
        // compute random damage with cardAttacker attack and cardDefender defense
        let damage = cardAttacker.attack - Math.random() * cardDefender.defence;
        if (damage < 0) {
            damage = 0;
        }
        console.log("\t- Damage: " + damage);
        // remove life from cardDefender
        cardDefender.hp = cardDefender.hp - damage;
        if (cardDefender.hp <= 0) {
            cardDefender.hp = 0;
        }
        // remove random between 10 and 100 energy from cardAttacker
        const energyToRemove = 10 + Math.random() * 90;
        console.log("\t- Energy lost: " + energyToRemove);
        cardAttacker.energy -= energyToRemove;
        if (cardAttacker.energy <= 0) {
            cardAttacker.energy = 0;
        }
        // send update to players
        io.to(game.gameId).emit("updateGame", game);
    }

    public endTurn(io: Server, socket: Socket, gameId: string) {
        // get game
        const game = this.currentGames.find(g => g.gameId === gameId);
        if (!game) {
            return;
        }
        console.log("Player " + game.nextTurn.surName + " is ending his turn");
        // add action points
        game.player1.actionPoints ? game.player1.actionPoints *= 2 : game.player1.actionPoints = 1;
        game.player2.actionPoints ? game.player2.actionPoints *= 2 : game.player2.actionPoints = 1;
        // change turn
        game.nextTurn = game.player1.id === game.nextTurn.id ? game.player2 : game.player1;
        // add energy to cards
        game.player1.cards?.forEach(c => {
            c.energy += 10 + Math.random() * 90
            c.energy > 1000 ? c.energy = 1000 : null;
        });
        game.player2.cards?.forEach(c => {
            c.energy += 10 + Math.random() * 90
            c.energy > 1000 ? c.energy = 1000 : null;
        });

        // send update to players
        io.to(game.gameId).emit("updateGame", game);
    }
}