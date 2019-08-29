const mongoose = require("mongoose");
const validator = require("validator");
const SchemaHelper = require("./utils/SchemaHelper");

let schema = {
  name: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  age: {
    type: Number
  }
};

schema = SchemaHelper.addCommonFields(
  schema,
  {
    required: true,
    trim: true
  },
  true,
  true
);

const User = mongoose.model("User", schema);

module.exports = {
  User
};
