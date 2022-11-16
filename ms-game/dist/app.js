"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
});
const ioServer = new socket_io_1.Server();
ioServer.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('myEvent1', function (data) {
        // Do stuff
        socket.emit('myEvent2', data);
    });
});
app.listen(port, () => {
    console.log(`⚡️🖨️[server]: Server is running at http://localhost:${port}`);
});
