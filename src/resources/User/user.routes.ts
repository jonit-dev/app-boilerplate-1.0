import { Router } from 'express';

import { userAuthMiddleware } from '../../middlewares/auth.middleware';
import LanguageHelper from '../../utils/LanguageHelper';
import RouterHelper from '../../utils/RouterHelper';
import User from './user.model';

// @ts-ignore
const router = new Router();

// load auth middleware for adding into specific routes!

/*#############################################################|
|  >>> PUBLIC ROUTES
*##############################################################*/

// Authentication ========================================

// User => Login
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  console.log(`logging user: ${email}`);

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
router.post('/users', async (req, res) => {
  const { name, email, password, age } = req.body;

  const user = new User({
    name,
    email,
    password,
    age
  });

  try {
    await user.save();

    const token = await user.generateAuthToken();

    console.log(`User created: ${user.email}`);

    return res.status(201).send({
      user,
      token
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('user', 'userCreationError'),
      details: error.message
    });
  }
});

/*#############################################################|
|  >>> PROTECTED ROUTES
*##############################################################*/

// Authentication routes ========================================

// User ==> Logout
router.post('/users/logout', userAuthMiddleware, async (req, res) => {
  const { user } = req;
  const reqToken = req.token;

  try {
    // remove the token that's being used for the user from our user tokens array in our database
    user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== reqToken);

    console.log(`Logging out user: ${user.email}`);

    await user.save(); // save user model to update records

    return res.status(200).send({
      status: 'success',
      message: LanguageHelper.getLanguageString('user', 'userLogoutSuccess')
    });
  } catch (error) {
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('user', 'userLogoutError'),
      details: error.message
    });
  }
});

// User ==> Logout all connected devices

router.post('/users/logout/all', userAuthMiddleware, async (req, res) => {
  const { user } = req;

  try {
    user.tokens = [];

    await user.save();

    return res.status(200).send({
      status: 'success',
      message: LanguageHelper.getLanguageString('user', 'userLogoutAllSuccess')
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('user', 'userLogoutAllError'),
      details: error.message
    });
  }
});

// CRUD routes ========================================

// User ==> Delete your own profile

router.delete('/users/me', userAuthMiddleware, async (req, res) => {
  const { user } = req;

  try {
    await user.remove();

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('user', 'userDeleteError'),
      details: error.message
    });
  }
});

router.get('/users/profile', userAuthMiddleware, async (req, res) => {
  const { user } = req;

  try {
    return res.status(200).send({
      user
    }); // req.user is coming from the authMiddleware
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('user', 'userProfileGetError'),
      details: error.message
    });
  }

  // try {
  //   const users = await User.find({});
  //   if (!users) {
  //     return res.status(404).send({
  //       status: "error",
  //       message: LanguageHelper.getLanguageString("user", "usersNotFound")
  //     });
  //   }
  //   return res.status(200).send(users);
  // } catch (error) {
  //   res.status(400).send(error);
  // }
});

router.patch('/users/me', userAuthMiddleware, async (req, res) => {
  const { user } = req;
  const updates = Object.keys(req.body);

  if (
    !RouterHelper.isAllowedKey(req.body, ['name', 'email', 'password', 'age'])
  ) {
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString(
        'user',
        'userPatchForbiddenKeys'
      )
    });
  }
  try {
    // update every key on the user object
    updates.forEach(update => {
      user[update] = req.body[update];
    });
    await user.save();

    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true, //return updated user
    //   runValidators: true //run our standard validators on update
    // });

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('user', 'userFailedUpdate'),
      details: error.message
    });
  }
});

export default router;
