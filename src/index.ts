import express from "express";

import mongoose from "mongoose";

import serverConfig from "./constants/serverConfig";

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
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

import { maintenanceMode } from "./middlewares/global.middleware";

if (serverConfig.maintenanceMode) {
  app.use(maintenanceMode);
}

// app.use(middleware.checkMethods);

/*#############################################################|
|  >>> ROUTES
*##############################################################*/

import userRoutes from "./resources/User/user.routes";

import taskRoutes from "./resources/Task/task.routes";

// USERS ========================================

app.use(userRoutes);

// TASKS ========================================

app.use(taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
