const jwt = require("jsonwebtoken");
const User = require("../resources/User/user.model");
const LanguageHelper = require("../utils/LanguageHelper");
const serverConfig = require("../constants/serverConfig.json");

const userAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", ""); //remove Bearer string

    const decoded = jwt.verify(token, serverConfig.jwtSecret);

    //find an user with the correct id (passed through the token), that has the particular token stored.

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });

    if (!user) {
      return res.status(401).send({
        status: "error",
        message: LanguageHelper.getLanguageString("user", "userNotFoundByToken")
      });
    }

    req.token = token;
    req.user = user;
    //proceed with user access
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send({
      status: "error",
      message: LanguageHelper.getLanguageString("user", "userNotAuthenticated")
    });
  }
};

module.exports = {
  userAuthMiddleware
};
