
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { id, username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});


let user = {
    "id" :  id,
    "username": username, 
    "cards" : []
}

let gameID; 

const socket = io();

// Join waiting list
socket.emit('joinWaitingList', { user });

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('startingPlay', ({ game, usersPlaying }) => {
    if(usersPlaying.includes(user.id)){
        gameID = game.id; 

        if(game.user1.id == user.id)
            alert("You are player 1\nSTARTING TO PLAY WITH "  + game.user2.name)
        else alert("You are player 2\nSTARTING TO PLAY WITH "  + game.user1.name)
        console.log("Starting to play !!! ")
        console.log(game)
        console.log(users)
    }
    
});

function attack(){
    let attackedCard = 1;
    let attackingCard = 1;
    socket.emit('play', { gameID, userID, attackingCard, attackedCard });
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
