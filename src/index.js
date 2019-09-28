const express = require("express");
const mongoose = require("mongoose");
const serverConfig = require("./serverConfig.dev.json");
mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
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

const middleware = require("./global/middlewares");

if (serverConfig.maintenanceMode) {
  app.use(middleware.maintenanceMode);
}

// app.use(middleware.checkMethods);

/*#############################################################|
|  >>> ROUTES
*##############################################################*/

const userRoutes = require("./resources/User/user.routes");
const taskRoutes = require("./resources/Task/task.routes");

// USERS ========================================

app.use(userRoutes);

// TASKS ========================================

app.use(taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
