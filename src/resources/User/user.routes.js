const express = require("express");
const router = new express.Router();
const { User } = require("./user.model");
const RouterHelper = require("../../utils/RouterHelper");
const authMiddleware = require("../../middlewares/auth.middleware");
const LanguageHelper = require("../../utils/LanguageHelper");

//load auth middleware for adding into specific routes!

/*#############################################################|
|  >>> PUBLIC ROUTES
*##############################################################*/

// Authentication ========================================

//User => Login
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(`logging user: ${email} => ${password}`);

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    return res.status(200).send({
      user,
      token
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    res.status(400).send({
      error: error.toString()
    });
  }
});

// User => Sign Up
router.post("/users", async (req, res) => {
  let { name, email, password, age } = req.body;

  const user = new User({
    name,
    email,
    password,
    age
  });

  try {
    await user.save();

    const token = await user.generateAuthToken();

    return res.status(201).send({
      user,
      token
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

/*#############################################################|
|  >>> PRIVATE ROUTES
*##############################################################*/

// Main routes ========================================

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: LanguageHelper.getLanguageString("user", "userDeleteNotFound")
      });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.get("/users", authMiddleware.auth, async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      return res.status(404).send({
        status: "error",
        message: LanguageHelper.getLanguageString("user", "usersNotFound")
      });
    }
    return res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: LanguageHelper.getLanguageString("user", "userNotFound")
      });
    }

    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send(error);
  }

  // User.findById(id)
  //   .then(result => {
  //     if (!result) {
  //       return res.status(404).send({
  //         status: "error",
  //         message: "User not found"
  //       });
  //     }

  //     console.log(result);
  //     return res.status(200).send(result);
  //   })
  //   .catch(err => res.status(500).send());
});

router.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const updates = Object.keys(req.body);

  if (
    !RouterHelper.isAllowedKey(req.body, ["name", "email", "password", "age"])
  ) {
    return res.status(400).send({
      status: "error",
      message: LanguageHelper.getLanguageString(
        "user",
        "userPatchForbiddenKeys"
      )
    });
  }
  try {
    const user = await User.findById(id);

    //update every key on the user object
    updates.forEach(update => {
      user[update] = req.body[update];
    });
    await user.save();

    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true, //return updated user
    //   runValidators: true //run our standard validators on update
    // });

    if (!user) {
      return status(400).send({
        status: "error",
        message: LanguageHelper.getLanguageString("user", "userFailedUpdate")
      });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

module.exports = router;
