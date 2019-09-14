const express = require("express");
const router = new express.Router();
const { User } = require("./model");

const UserHelper = require("../../utils/UserHelper");
const RouterHelper = require("../../utils/RouterHelper");

router.post("/users", async (req, res) => {
  let { name, email, password, age } = req.body;

  const hashedPassword = await UserHelper.hashPassword(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    age
  });

  try {
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "User not found"
      });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      return res.status(404).send({
        status: "error",
        message: "No users found!"
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
        message: "No user found!"
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
      message: "You're trying to update forbidden keys"
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
        message: "failed to update your user!"
      });
    }

    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
