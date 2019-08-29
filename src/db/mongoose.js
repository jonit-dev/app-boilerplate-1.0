const { User } = require("./models/User");
const { Task } = require("./models/Task");

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true
});

// const me = new User({
//   name: "Test",
//   email: "joao@countable.ca",
//   age: 28,
//   password: "123"
// })
//   .save()
//   .then(result => console.log(result))
//   .catch(err => console.log(err));

const task = new Task({
  description: "This is a new task",
  completed: false
})
  .save()
  .then(result => console.log(result))
  .catch(err => console.log(err));
