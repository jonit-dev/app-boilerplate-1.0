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
const fs_1 = require("fs");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const LanguageHelper_1 = require("../../utils/LanguageHelper");
const RouterHelper_1 = require("../../utils/RouterHelper");
const user_model_1 = require("./user.model");
// @ts-ignore
const userRouter = new express_1.Router();
exports.userRouter = userRouter;
// load auth middleware for adding into specific routes!
/*#############################################################|
|  >>> PUBLIC ROUTES
*##############################################################*/
// Authentication ========================================
// User => Login
userRouter.post('/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(`logging user: ${email}`);
    try {
        const user = yield user_model_1.User.findByCredentials(email, password);
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
userRouter.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, age } = req.body;
    const user = new user_model_1.User({
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
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userCreationError'),
            details: error.message
        });
    }
}));
/*#############################################################|
|  >>> PROTECTED ROUTES
*##############################################################*/
// Authentication routes ========================================
// User ==> Logout
userRouter.post('/users/logout', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const reqToken = req.token;
    try {
        // remove the token that's being used for the user from our user tokens array in our database
        user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== reqToken);
        console.log(`Logging out user: ${user.email}`);
        yield user.save(); // save user model to update records
        return res.status(200).send({
            status: 'success',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userLogoutSuccess')
        });
    }
    catch (error) {
        return res.status(400).send({
            status: 'error',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userLogoutError'),
            details: error.message
        });
    }
}));
// User ==> Logout all connected devices
userRouter.post('/users/logout/all', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        user.tokens = [];
        yield user.save();
        return res.status(200).send({
            status: 'success',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userLogoutAllSuccess')
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            status: 'error',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userLogoutAllError'),
            details: error.message
        });
    }
}));
// Upload routes ========================================
const upload = multer_1.default({
    // multer (upload library) configuration
    limits: {
        fileSize: 1000000 // 1.000.000 bytes = 1 mb
    },
    fileFilter(req, file, cb) {
        // file type restriction
        console.log(`received file ${file.originalname}`);
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            // reject file callback
            return cb(new Error('Please, upload a jpg or png file'));
        }
        cb(undefined, true); // acccept file callback
    },
    storage: multer_1.default.diskStorage({
        destination(req, file, cb) {
            const { user } = req;
            // create user directory, if it does not exists yet
            if (!fs_1.existsSync(`uploads/images/${user._id}`)) {
                fs_1.mkdirSync(`uploads/images/${user._id}`);
            }
            // save the uploaded file
            cb(null, `uploads/images/${user._id}`);
        },
        filename(req, file, cb) {
            cb(null, file.originalname);
        }
    })
});
// !upload-key should match postman's form-data key. set key as 'file' instead of text
userRouter.post('/profile/avatar', [auth_middleware_1.userAuthMiddleware, upload.single('avatar')], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('uploading your file...');
    try {
        return res.status(200).send({
            status: 'success',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userFileUploaded')
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'error',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userErrorFileUpload'),
            details: error.message
        });
    }
}));
// CRUD routes ========================================
// User ==> Delete your own profile
userRouter.delete('/users/me', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        yield user.remove();
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            status: 'error',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userDeleteError'),
            details: error.message
        });
    }
}));
userRouter.get('/users/profile', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        return res.status(200).send({
            user
        }); // req.user is coming from the authMiddleware
    }
    catch (error) {
        return res.status(500).send({
            status: 'error',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userProfileGetError'),
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
userRouter.patch('/users/me', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const updates = Object.keys(req.body);
    if (!RouterHelper_1.RouterHelper.isAllowedKey(req.body, ['name', 'email', 'password', 'age'])) {
        return res.status(400).send({
            status: 'error',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userPatchForbiddenKeys')
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
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userFailedUpdate'),
            details: error.message
        });
    }
}));
