
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { id, username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});


let user = {
    "id": id,
    "username": username,
    "cards": []
}

let userStat;

let gameID;

const socket = io();

// Join waiting list
socket.emit('joinWaitingList', { user });

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('startingPlay', ({ game, user1, user2, usersPlaying }) => {
    console.log(game, user1, user2, usersPlaying)
    if (usersPlaying.includes(user.id)) {
        gameID = game.id;



        if (game.user1 == user.id) {
            alert("You are player 1\nSTARTING TO PLAY WITH " + user2.username);
            userStat = user1;
        }
        else {
            alert("You are player 2\nSTARTING TO PLAY WITH " + user1.username);
            userStat = user2;
        }

        if (game.nextTurn == user.id) {
            //TODO
            alert("It's your turn");
            attack()
        } else {
            //TODO
            alert("Waiting for your turn");
        }

    }

});


socket.on('playAction', ({ game, user1, user2, usersPlaying }) => {
    console.log(game, user1, user2, usersPlaying)
    // On vérifie si l'info concerne les bons utilisateurs dans la bonne partie
    if (usersPlaying.includes(user.id) && game.id == gameID) {

        if (game.user1 == user.id) {
            userStat = user1;
        }
        else {userStat = user2;}

        if (game.nextTurn == user.id) {
            //TODO
            alert("It's your turn\nYou have " + userStat.actionPoint + " points. ");
            attack();
        } else {
            //TODO
            alert("Waiting for your turn\nYou have " + userStat.actionPoint + " points.");
        }
    }

});


function attack() {
    alert("Attacking")
    let attackedCard = 1; //TODO: Récupérer les cartes sélectionnées
    let attackingCard = 1;
    let userID = user.id
    socket.emit('attack', { gameID, userID, attackingCard, attackedCard });
}

function endTurn() {
    socket.emit('endTurn', { gameID, userID });
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user;
        userList.appendChild(li);
    });
}
