// index.js

// Source : https://www.cometchat.com/tutorials/how-to-build-a-chat-app-with-websockets-and-node-js 

const axios = require('axios')
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

var cors = require('cors');
app.use(cors());


const io = require('socket.io')(server, {cors: {origin: "*"}});
let users = []
// Set public folder
app.use(express.static(path.join(__dirname, 'public')));





// Récupération des utilisateurs via HTTP 
async function getUsers(){
    axios.get(process.env.URL_MS_USER).then(resp => {
        if (resp.data) {
            console.log(resp.data)
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
        console.log(room)
        const user = newUser(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage("", 'Bienvenue '));

        // Broadcast everytime users connects
        socket.broadcast.to(user.room).emit('message',formatMessage("--", `${user.username} a rejoint la discussion`));

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


        // METTRE LA SAUVEGARDE DES MESSAGES ICI


    });

    socket.on('sendEveryone', msg => {
        const user = getActiveUser(socket.id);
        io.sockets.emit('broadcast' ,formatMessage(user.username, msg))


        // METTRE LA SAUVEGARDE DES MESSAGES ICI
        saveText(user.username, user.room, msg);


    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = exitRoom(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage("", `${user.username}  a quitté la discussion`)
            );

            // Current active users and room name
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getIndividualRoomUsers(user.room)
            });
        }
    });
});


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


async function saveText(user, room, message){
    console.log(user)
    console.log(room)
    console.log(message)
}

// ---------------------------------
const PORT = process.env.PORT || 8086;
server.listen(PORT, () =>{ getUsers(); console.log(`Server running on port ${PORT}`)});