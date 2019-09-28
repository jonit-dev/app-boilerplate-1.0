const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const LanguageHelper = require("../../utils/LanguageHelper");
const serverConfig = require("../../constants/serverConfig.json");

// Schema ========================================

let schema = {
  name: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  age: {
    type: Number
  },
  tokens: [
    //this will allow multi device sign in (different devices with different tokens)
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
};

/*#############################################################|
|  >>> MODEL FUNCTIONS (static, methods)
*##############################################################*/

// Statics ========================================

const userSchema = new mongoose.Schema(schema);

// statics are methods that you add to your model, making it possible to access them anywhere

userSchema.statics.hashPassword = async password => {
  return await bcrypt.hash(password, 8);
};

//methods create a normal method (instance needs to be declared). Statics functions, otherwise, doesnt need to be declared. It can be accessed directly through the model

//here we use function() instead of an arrow function because we need access to "this", that's not present on the later.

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, serverConfig.jwtSecret);

  //we can also pass an optional configuration object
  // const token = jwt.sign({ _id: user._id.toString() }, serverConfig.jwtSecret), { expiresIn: '7 days'});

  user.tokens = [...user.tokens, { token }];

  await user.save();

  return token;
};

//this will be fired whenever our model is converted to JSON!!

userSchema.methods.toJSON = function() {
  // delete keys that shouldn't be displayed publicly

  const user = this;
  const userObject = user.toObject(); //convert Mongoose model to Object

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(
      LanguageHelper.getLanguageString("user", "userNotFoundOnLogin")
    );
  }

  //if our provided password is equal to the stored password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error(
      LanguageHelper.getLanguageString("user", "userWrongPassword")
    );
  }

  return user; //return the user if everything is ok
};

/*#############################################################|
|  >>> MODEL MIDDLEWARES
*##############################################################*/

userSchema.pre("save", async function(next) {
  const user = this;

  // console.log('user :: middleware => Running pre "save" code');

  //this is the document being saved

  //check if password was modified (updated or created)
  if (user.isModified("password")) {
    user.password = await userSchema.statics.hashPassword(user.password);
  }

  next(); //proceed...
});

// model ========================================

const User = mongoose.model("User", userSchema);

module.exports = {
  User
};
