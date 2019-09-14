const mongoose = require("mongoose");
const validator = require("validator");
const SchemaHelper = require("../../utils/SchemaHelper");
const UserHelper = require("../../utils/UserHelper");

// Schema ========================================

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

// middlewares ========================================

const userSchema = new mongoose.Schema(schema);

userSchema.pre("save", async function(next) {
  const user = this;
  //this is the document being saved
  console.log("User Middleware => saving user model and hashing password...");

  //check if password was modified (updated or created)
  if (user.isModified("password")) {
    user.password = await UserHelper.hashPassword(user.password);
  }

  next(); //proceed...
});

// model ========================================

const User = mongoose.model("User", userSchema);

module.exports = {
  User
};
