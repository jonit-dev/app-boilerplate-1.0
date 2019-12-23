import Filter from 'bad-words';
import { exec } from 'child_process';
import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import socketio from 'socket.io';

import { ENV, serverConfig } from './constants/env';
import { GlobalMiddleware } from './middlewares/global.middleware';
import { taskRouter } from './resources/Task/task.routes';
import { userRouter } from './resources/User/user.routes';
import { MixpanelHelper } from './utils/MixpanelHelper';


mongoose.connect(serverConfig.app.mongodbConnectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

/*#############################################################|
|  >>> EXPRESS - INITIALIZATION
*##############################################################*/

// ! Tip: if nodemon hangs on "EADDRESSINUSE" error, run: "killall node"

const app = express();
const server = http.createServer(app); // socket.io requirement
const io = socketio(server); // now we pass this server variable to our server

const port = process.env.PORT || serverConfig.app.port;

const publicDirectory = path.join(__dirname, './public')

app.use(cors())

app.use(express.json()); // << THIS IS REQUIRED TO EXPRESS PARSING JSON DATA

// initialize mixpanel

console.log('Initializing mixpanel...');
MixpanelHelper.init();


// CRON JOBS ========================================
// MainCron.sampleCron();

/*#############################################################|
|  >>> MIDDLEWARES
*##############################################################*/

// app.use(GlobalMiddleware.enableCors);

if (serverConfig.maintenanceMode) {
  app.use(GlobalMiddleware.maintenanceMode);
}

// allows static files serving
app.use(express.static(publicDirectory))


// app.use(middleware.checkMethods);

/*#############################################################|
|  >>> ROUTES
*##############################################################*/

// USERS ========================================

app.use(userRouter);

// TASKS ========================================

app.use(taskRouter);

server.listen(port, () => {
  // tslint:disable-next-line: no-console
  console.log(`*** Server is running on port ${port} || ${ENV} ***`);
});

app.on("error", err => {
  // @ts-ignore
  if (err.code === "EADDRINUSE") {
    exec(`killall node`);
  }
});

// Static files ========================================



/*#############################################################|
|  >>> SOCKET.IO
*##############################################################*/

let usersConnected = 0;

io.on('connection', (socket) => {
  usersConnected++;
  console.log(`New user connected. Total connections: ${usersConnected}`);

  // emit to everyone
  io.emit('countUpdated', {
    usersConnected
  });
  // broadcast emits messages to everyone, except the current socket
  // socket.broadcast.emit('message', {
  //   name: 'Server',
  //   message: 'A new user has joined'
  // })


  // socket.emit would emit just for a specific connection instead
  socket.on('disconnect', () => {
    console.log('User disconnected!');
    usersConnected--;
    console.log(`Total connected users: ${usersConnected}`);

    // broadcast emits messages to everyone, except the current socket
    io.emit('message', {
      name: 'Server',
      message: 'An user has left the room!'
    })


  })

  // Room joining
  socket.on('join', ({ name, room }) => {
    socket.join(room);
    socket.broadcast.to(room).emit('message', {
      name,
      message: `${name} has joined the room ${room}`
    })
  })

  socket.on('message', ({ name, message, room }, callback) => {

    const filter = new Filter()

    if (filter.isProfane(message)) {
      return callback('Clean your mouth!')
    }

    console.log(`Received message from ${name}!`);
    console.log(message);
    // emit it to everyone
    io.to(room).emit('message', { name, message })
    callback('Event was received by the server');
  })


})

