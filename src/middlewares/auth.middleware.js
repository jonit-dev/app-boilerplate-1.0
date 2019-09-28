const jwt = require("jsonwebtoken");
const User = require("../resources/User/user.model");
const LanguageHelper = require("../utils/LanguageHelper");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer "); //remove Bearer string

    console.log(token);
  } catch (error) {
    console.error(error);
    res.status(401).send({
      error: LanguageHelper.getLanguageString("user", "userNotAuthenticated")
    });
  }

  next();
};

module.exports = {
  auth
};
