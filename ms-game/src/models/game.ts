export default class Game {
    constructor() {
        this.gameId = uuid.v4();
    }
    
    addPlayer(player) {
        this.players.push(player);
        this.playerCount++;
    }
}