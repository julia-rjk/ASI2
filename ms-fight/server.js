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
dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));

let usersWaiting = []
let users = {}
let currentGames = []



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

    // Création de la partie 
    let game = {
        "id": 0,
        "user1": {
            "id": user1.id,
            "name": user1.username,
            "actionPoint" : user1.actionPoint,
            "cards" : user1.cards
        },
        "user2": {
            "id": user2.id,
            "name": user2.username,
            "actionPoint" : user2.actionPoint,
            "cards" : user2.cards
        },
        "nextTurn": user1.id
    }   
    currentGames.push(game)
    // Avertit les utilisateurs séléctionnés, encore dans la liste d'attente, qu'ils vont jouer 
    // accompagné des informations 
    io.to("waitingRoom").emit('startingPlay', { game, usersPlaying });
}

function attack(gameID, userID, attackedCard, attackingCard){
    let currentGame = getGameById(gameID)
    let userPlaying, userAttacked;

    if(userID == currentGame.user1.id){ userPlaying = "user1"; userAttacked = "user2"}
    else{ userPlaying = "user2"; userAttacked = "user1"}
        
    if(currentGame.nextTurn == userID){

        // On enlève les points d'actions du joueur 

        //TODO: Implémenter les actions d'attaques, esquives etc

        // Change le tour
        if(userID == currentGame.user1.id) currentGame.nextTurn = currentGame.user2.id
        else currentGame.nextTurn = currentGame.user1.id

        // On sauvegarde le jeu 
        updateGame(currentGame)
    }

}


function getGameById(gameID){
    for(let game of currentGames){
        if(game.id == gameID) return game;
    }
}

function updateGame(currentGame){
    //TODO: Sauvegarder les modifications

    
    //TODO: Avertir des modifs
    sendPlayActions(currentGame)
}

function endTurn(gameID, userID){
    let currentGame = getGameById(gameID)
    if(userID == currentGame.user1.id) currentGame.nextTurn = currentGame.user2.id
    else currentGame.nextTurn = currentGame.user1.id
    updateGame(currentGame);

}

//TODO: 
function endGame(currentGame){

}

//TODO:
function sendPlayActions(game){
    io.emit('playAction', { game, usersPlaying });
}

// ---------------------------------
const PORT = process.env.PORT || 8087;
server.listen(PORT, () => { console.log(`Fight Server running on port ${PORT}`) });