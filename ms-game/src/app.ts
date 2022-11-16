import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.sendFile('public/index.html', { root: __dirname });
});

const ioServer = new Server();
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