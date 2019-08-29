const { Task } = require("./resources/Task/model");

const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const RouterHelper = require("./utils/RouterHelper");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Express initialization ========================================

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // << THIS IS REQUIRED TO EXPRESS PARSING JSON DATA

/*#############################################################|
|  >>> ROUTES
*##############################################################*/

const userRoutes = require("./resources/User/routes");
const taskRoutes = require("./resources/Task/routes");

// USERS ========================================

app.use(userRoutes);

// TASKS ========================================

app.use(taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
