import express from 'express';
import mongoose from 'mongoose';

import serverConfig from './constants/serverConfig';
import { maintenanceMode } from './middlewares/global.middleware';
import taskRoutes from './resources/Task/task.routes';
import userRoutes from './resources/User/user.routes';

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

/*#############################################################|
|  >>> EXPRESS - INITIALIZATION
*##############################################################*/

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // << THIS IS REQUIRED TO EXPRESS PARSING JSON DATA

/*#############################################################|
|  >>> MIDDLEWARES
*##############################################################*/

if (serverConfig.maintenanceMode) {
  app.use(maintenanceMode);
}

// app.use(middleware.checkMethods);

/*#############################################################|
|  >>> ROUTES
*##############################################################*/

// USERS ========================================

app.use(userRoutes);

// TASKS ========================================

app.use(taskRoutes);

app.listen(port, () => {
  // tslint:disable-next-line: no-console
  console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
  console.log('Bye bye!');
  process.exit();
});
