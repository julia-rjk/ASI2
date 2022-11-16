// index.js

// Source : https://www.cometchat.com/tutorials/how-to-build-a-chat-app-with-websockets-and-node-js 
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const uuid = require('uuid')

dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));

let usersWaiting = []
let users = {}
let currentGames = {}
let finishedGames = {}


// this block will run when the client connects
io.on('connection', socket => {

    socket.on('joinWaitingList', ({ user }) => {
        joinWaitingList(socket, user );
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        console.log("disconnect")
    });

    socket.on('attack', ( { gameID, userID, attackingCard, attackedCard }) => {
        attack(gameID, userID, attackingCard, attackedCard)
    });

    socket.on('endTurn', ( { gameID, userID }) => {
        endTurn(gameID, userID)
    });

});

// L'utilisateur rejoint la liste d'attente
function joinWaitingList(socket, user) {

    socket.join("waitingRoom");
    usersWaiting.push(user.id)
    users[user.id] = user


    // S'il n'y a pas 2 utilisateurs en attente
    if (usersWaiting.length < 2) {

        // On lui envoi l'information concernant la liste d'attente
        io.to("waitingRoom").emit('roomUsers', {
            room: "waitingRoom",
            users: usersWaiting
        });

    } else {
        // On sélectionne les 2 joueurs de la liste, on lance un nouveau jeu et on vide la liste d'attente
        let usersPlaying = [ usersWaiting[0], usersWaiting[1] ]
        startNewPlay(usersPlaying)
        usersWaiting = []
    }
}

// Lance un nouveau jeu
function startNewPlay(usersPlaying){
    users[usersPlaying[0]].actionPoint = 100;
    users[usersPlaying[1]].actionPoint = 100;
    
    let user1 = users[usersPlaying[0]];
    let user2 = users[usersPlaying[1]];
    let gameID =  uuid.v4();

    // Création de la partie 
    let game = {
        "id": gameID,
        "user1": user1.id,
        "user2": user2.id,
        "nextTurn": user1.id
    }   
    currentGames[gameID] = game; 

    // Avertit les utilisateurs séléctionnés, encore dans la liste d'attente, qu'ils vont jouer 
    // accompagné des informations 
    io.to("waitingRoom").emit('startingPlay', { game, user1, user2, usersPlaying });
}

function attack(gameID, userID, attackedCard, attackingCard){
    console.log(userID + " is attacking ")
    let currentGame = getGameById(gameID)
    let userPlaying, userAttacked;

    userPlaying = users[userID];

    if(userID == currentGame.user1){ userAttacked = users[currentGame.user2]}
    else{ userAttacked = users[currentGame.user1]}
        
    if(currentGame.nextTurn == userID){
        //TODO: On enlève les points d'actions du joueur 
        console.log( userPlaying.actionPoint)
        userPlaying.actionPoint =  userPlaying.actionPoint - 10;

        //TODO: Implémenter les actions d'attaques, esquives etc
            //users[userAttacked].cards[attackedCard]

        // On verifie si un des joueurs n'a plus de points
            // Si c'est le cas, on termine le jeu
                // endGame(currentGame)
            // Sinon
                // Change le tour & sauvegarde le jeu 
                endTurn(currentGame.id, userPlaying, userAttacked);
    }
}

function getGameById(gameID){
    return currentGames[gameID];
}

//TODO: Mettre à jour le jeu, le joueur 1 & le joueur 2
function updateGame(currentGame, user1 = undefined, user2 = undefined){
    currentGames[currentGame.id] = currentGame;

    if(user1 != undefined ) users[user1.id] = user1;
    if(user2 != undefined ) users[user2.id] = user2;

    //Avertir des modifications
    sendPlayActions(currentGame, user1, user2)
}

function endTurn(gameID, userPlaying, userAttacked){
    let currentGame = getGameById(gameID)
    
    if(userPlaying.id == currentGame.user1) currentGame.nextTurn = currentGame.user2
    else currentGame.nextTurn = currentGame.user1
    
    updateGame(currentGame);
}

//TODO: 
function endGame(currentGame){
    delete currentGames[currentGame.id];
    finishedGames[currentGame.id] = currentGame;

    //TODO: Envoyer les informations de fin de jeu au backend springboot
}

//TODO:
function sendPlayActions(game){
    usersPlaying = [game.user1, game.user2];
    
    user1 = users[game.user1]
    user2 = users[game.user2]
    
    io.emit('playAction', { game, user1, user2, usersPlaying });
}

// ---------------------------------
const PORT = process.env.PORT || 8087;
server.listen(PORT, () => { 
    console.log(`Test:\nhttp://localhost:8087/chat.html?id=1&username=Charles\nhttp://localhost:8087/chat.html?id=2&username=Timothee`);
    console.log(`\nFight Server running on port ${PORT}`); });