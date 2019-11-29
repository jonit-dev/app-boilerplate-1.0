import { exec } from 'child_process';
import express from 'express';
import mongoose from 'mongoose';

import { ENV, serverConfig } from './constants/env';
import { MainCron } from './cron_jobs/main.cron';
import { GlobalMiddleware } from './middlewares/global.middleware';
import { taskRouter } from './resources/Task/task.routes';
import { userRouter } from './resources/User/user.routes';

mongoose.connect(serverConfig.app.mongodbConnectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

/*#############################################################|
|  >>> EXPRESS - INITIALIZATION
*##############################################################*/

// ! Tip: if nodemon hangs on "EADDRESSINUSE" error, run: "killall node"

const app = express();
const port = process.env.PORT || serverConfig.app.port;

app.use(express.json()); // << THIS IS REQUIRED TO EXPRESS PARSING JSON DATA

MainCron.sampleCron();

/*#############################################################|
|  >>> MIDDLEWARES
*##############################################################*/

// app.use(GlobalMiddleware.enableCors);

if (serverConfig.maintenanceMode) {
  app.use(GlobalMiddleware.maintenanceMode);
}

// app.use(middleware.checkMethods);

/*#############################################################|
|  >>> ROUTES
*##############################################################*/

// USERS ========================================

app.use(userRouter);

// TASKS ========================================

app.use(taskRouter);

app.listen(port, () => {
  // tslint:disable-next-line: no-console
  console.log(`*** Server is running on port ${port} || ${ENV} ***`);
});

app.on("error", err => {
  // @ts-ignore
  if (err.code === "EADDRINUSE") {
    exec(`killall node`);
  }
});
