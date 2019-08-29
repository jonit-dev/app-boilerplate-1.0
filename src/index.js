const { User } = require("./db/models/User");
const { Task } = require("./db/models/Task");

const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

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

// USERS ========================================

app.post("/users", (req, res) => {
  const { name, email, password, age } = req.body;

  const user = new User({
    name,
    email,
    password,
    age
  })
    .save()
    .then(result => {
      return res.status(201).send(result);
    })
    .catch(err => {
      return res.status(400).send({
        status: "error",
        message: {
          errors: err.errors
        }
      });
    });
});

app.get("/users", (req, res) => {
  User.find({})
    .then(users => {
      return res.status(200).send(users);
    })
    .catch(err => {
      return res.status(500).send();
    });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  console.log(req.params);

  User.findById(id)
    .then(result => {
      if (!result) {
        return res.status(404).send({
          status: "error",
          message: "User not found"
        });
      }

      console.log(result);
      return res.status(200).send(result);
    })
    .catch(err => res.status(500).send());
});

// TASKS ========================================

app.post("/tasks", (req, res) => {
  const { description, completed } = req.body;

  const task = new Task({
    description,
    completed
  })
    .save()
    .then(result => res.status(201).send(result))
    .catch(err =>
      res.status(400).send({
        status: "error",
        message: {
          error: err.errors
        }
      })
    );
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then(results => {
      if (!results) {
        return res.status(404).send({
          status: "error",
          message: "Tasks not found!"
        });
      }

      return res.status(200).send(results);
    })
    .catch(err => res.status(500).send());
});

// number of complete tasks (promise chaining sample)

app.get("/tasks/completed", (req, res) => {
  Task.find({ completed: true })
    .then(tasks => {
      if (!tasks) {
        return res.status(404).send({
          status: "error",
          message: "No tasks found"
        });
      }

      return Task.countDocuments({ completed: true });
    })
    .then(count => {
      return res.status(200).send({
        numberOfTasks: count
      });
    })
    .catch(err => {
      return res.status(400).send(err);
    });
});

app.get("/tasks/:id", (req, res) => {
  const { id } = req.params;

  Task.findById(id)
    .then(results => {
      if (!results) {
        return res.status(404).send({
          status: "error",
          message: "Tasks not found!"
        });
      }

      return res.status(200).send(results);
    })
    .catch(err => res.status(500).send());
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const deleteTaskAndCount = async id => {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(400).send({
        status: "error",
        message: "Task not found"
      });
    } else {
      const count = await Task.countDocuments({ completed: false });

      return res.status(200).send({
        status: "success",
        message: "Task deleted",
        tasksLeft: count
      });
    }
  };
  deleteTaskAndCount(id);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
