"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const LanguageHelper_1 = __importDefault(require("../../utils/LanguageHelper"));
const RouterHelper_1 = __importDefault(require("../../utils/RouterHelper"));
const user_model_1 = __importDefault(require("./user.model"));
// @ts-ignore
const router = new express_1.Router();
// load auth middleware for adding into specific routes!
/*#############################################################|
|  >>> PUBLIC ROUTES
*##############################################################*/
// Authentication ========================================
// User => Login
router.post('/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(`logging user: ${email}`);
    try {
        const user = yield user_model_1.default.findByCredentials(email, password);
        const token = yield user.generateAuthToken();
        return res.status(200).send({
            user,
            token
        });
    }
    catch (error) {
        console.log(`ERROR: ${error}`);
        res.status(400).send({
            error: error.toString()
        });
    }
}));
// User => Sign Up
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, age } = req.body;
    const user = new user_model_1.default({
        name,
        email,
        password,
        age
    });
    try {
        yield user.save();
        const token = yield user.generateAuthToken();
        console.log(`User created: ${user.email}`);
        return res.status(201).send({
            user,
            token
        });
    }
    catch (error) {
        res.status(400).send({
            status: 'error',
            message: LanguageHelper_1.default.getLanguageString('user', 'userCreationError'),
            details: error.message
        });
    }
}));
/*#############################################################|
|  >>> PROTECTED ROUTES
*##############################################################*/
// Authentication routes ========================================
// User ==> Logout
router.post('/users/logout', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const reqToken = req.token;
    try {
        // remove the token that's being used for the user from our user tokens array in our database
        user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== reqToken);
        console.log(`Logging out user: ${user.email}`);
        yield user.save(); // save user model to update records
        return res.status(200).send({
            status: 'success',
            message: LanguageHelper_1.default.getLanguageString('user', 'userLogoutSuccess')
        });
    }
    catch (error) {
        return res.status(400).send({
            status: 'error',
            message: LanguageHelper_1.default.getLanguageString('user', 'userLogoutError'),
            details: error.message
        });
    }
}));
// User ==> Logout all connected devices
router.post('/users/logout/all', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        user.tokens = [];
        yield user.save();
        return res.status(200).send({
            status: 'success',
            message: LanguageHelper_1.default.getLanguageString('user', 'userLogoutAllSuccess')
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            status: 'error',
            message: LanguageHelper_1.default.getLanguageString('user', 'userLogoutAllError'),
            details: error.message
        });
    }
}));
// CRUD routes ========================================
// User ==> Delete your own profile
router.delete('/users/me', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        yield user.remove();
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            status: 'error',
            message: LanguageHelper_1.default.getLanguageString('user', 'userDeleteError'),
            details: error.message
        });
    }
}));
router.get('/users/profile', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        return res.status(200).send({
            user
        }); // req.user is coming from the authMiddleware
    }
    catch (error) {
        return res.status(500).send({
            status: 'error',
            message: LanguageHelper_1.default.getLanguageString('user', 'userProfileGetError'),
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
}));
router.patch('/users/me', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const updates = Object.keys(req.body);
    if (!RouterHelper_1.default.isAllowedKey(req.body, ['name', 'email', 'password', 'age'])) {
        return res.status(400).send({
            status: 'error',
            message: LanguageHelper_1.default.getLanguageString('user', 'userPatchForbiddenKeys')
        });
    }
    try {
        // update every key on the user object
        updates.forEach(update => {
            user[update] = req.body[update];
        });
        yield user.save();
        // const user = await User.findByIdAndUpdate(id, req.body, {
        //   new: true, //return updated user
        //   runValidators: true //run our standard validators on update
        // });
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            status: 'error',
            message: LanguageHelper_1.default.getLanguageString('user', 'userFailedUpdate'),
            details: error.message
        });
    }
}));
exports.default = router;
