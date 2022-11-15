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

    // socket.on('play', ({ username }) => {

    //     if(usersWaiting.length == 0){
    //         usersWaiting.push(username)
    //     }else{

    //     }


    //     const user = newUser(socket.id, username, room);

    //     socket.join(user.room);

    //     // General welcome
    //     socket.emit('message', formatMessage("", 'Bienvenue '));

    //     // Broadcast everytime users connects
    //     socket.broadcast
    //         .to(user.room)
    //         .emit(
    //             'message',
    //             formatMessage("--", `${user.username} a rejoint le chat`)
    //         );

    //     // Current active users and room name
    //     io.to(user.room).emit('roomUsers', {
    //         room: user.room,
    //         users: getIndividualRoomUsers(user.room)
    //     });
    // });

    // // Listen for client message
    // socket.on('chatMessage', msg => {
    //     const user = getActiveUser(socket.id);

    //     io.to(user.room).emit('message', formatMessage(user.username, msg));
    // });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        console.log("disconnect")
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
        }
    }   
    currentGames.push(game)
    // Avertit les utilisateurs séléctionnés encore dans la liste d'attente qu'ils vont jouer 
    // accompagné des informations 
    io.to("waitingRoom").emit('startingPlay', { game, usersPlaying });
}


function play(id, user, action){
    
}

// ---------------------------------
const PORT = process.env.PORT || 8087;
server.listen(PORT, () => { console.log(`Fight Server running on port ${PORT}`) });