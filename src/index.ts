import { exec } from 'child_process';
import cors from 'cors';
import express from 'express';
import formData from 'express-form-data';
import http from 'http';
import mongoose from 'mongoose';
import os from 'os';
import path from 'path';
import socketio from 'socket.io';

import { ENV, serverConfig } from './constants/env';
import { RetentionCron } from './cron_jobs/retention.cron';
import { GlobalMiddleware } from './middlewares/global.middleware';
import { conversationRouter } from './resources/Conversation/conversation.routes';
import { postRouter } from './resources/Post/post.routes';
import { taskRouter } from './resources/Task/task.routes';
import { userRouter } from './resources/User/user.routes';
import { MixpanelHelper } from './utils/MixpanelHelper';
import { SocketIOHelper } from './utils/SocketIOHelper';


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

export const publicDirectory = path.join(__dirname, './public')

app.use(cors())

app.use(express.json()); // << THIS IS REQUIRED TO EXPRESS PARSING JSON DATA

// initialize mixpanel

console.log('Initializing mixpanel...');
MixpanelHelper.init();


// CRON JOBS ========================================
// MainCron.sampleCron();
RetentionCron.inactiveUserReminder()

/*#############################################################|
|  >>> MIDDLEWARES
*##############################################################*/

// handling formdata

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

// parse data with connect-multiparty.
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream
app.use(formData.stream());
// union the body and the files
app.use(formData.union());


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


app.use(userRouter);
app.use(taskRouter);
app.use(conversationRouter)
app.use(postRouter)

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


SocketIOHelper.initialize(io);
