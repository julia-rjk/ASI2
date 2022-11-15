// index.js

// Source : https://www.cometchat.com/tutorials/how-to-build-a-chat-app-with-websockets-and-node-js 


const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./helpers/formatDate')
const {
    getActiveUser,
    exitRoom,
    newUser,
    getIndividualRoomUsers
} = require('./helpers/userHelper');


const dotenv = require('dotenv');
dotenv.config();


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const users = []
// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

async function getUsers(){
    axios.get(process.env.URL_MS_USER_GET).then(resp => {
        if (resp.data) {
            users = resp.data
        } else {
            console.log(resp)
        }
    }).catch(err => {
        console.log(err)
    })
}






// this block will run when the client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = newUser(socket.id, username, room);

        socket.join(user.room);

        // General welcome
        socket.emit('message', formatMessage("", 'Bienvenue '));

        // Broadcast everytime users connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage("--", `${user.username} a rejoint le chat`)
            );

        // Current active users and room name
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        });
    });

    // Listen for client message
    socket.on('chatMessage', msg => {
        const user = getActiveUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = exitRoom(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage("WebCage", `${user.username} has left the room`)
            );

            // Current active users and room name
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getIndividualRoomUsers(user.room)
            });
        }
    });
});

// ---------------------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>{ getUsers(); console.log(`Server running on port ${PORT}`)});