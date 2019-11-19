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
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const env_1 = require("../../constants/env");
const account_email_1 = require("../../emails/account.email");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const LanguageHelper_1 = require("../../utils/LanguageHelper");
const RouterHelper_1 = require("../../utils/RouterHelper");
const TextHelper_1 = require("../../utils/TextHelper");
const user_model_1 = require("./user.model");
// @ts-ignore
const userRouter = new express_1.Router();
exports.userRouter = userRouter;
userRouter.post("/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const preparedEmail = TextHelper_1.TextHelper.stringPrepare(email);
    console.log(`logging user: ${preparedEmail}`);
    try {
        const user = yield user_model_1.User.findByCredentials(preparedEmail, password);
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
userRouter.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    //force lowercase and trim
    const preparedEmail = TextHelper_1.TextHelper.stringPrepare(email);
    const user = new user_model_1.User({
        name,
        preparedEmail,
        password
    });
    try {
        yield user.save();
        const token = yield user.generateAuthToken();
        console.log(`User created: ${user.email}`);
        const accountEmailManager = new account_email_1.AccountEmailManager();
        // sample email
        accountEmailManager.newAccount("jfurtado141@gmail.com", "Hello World!", "welcome", {
            name: "Joao",
            login_url: "http://appboilerplate.com/login",
            username: "joaouser",
            trial_start_date: "2019-11-09",
            trial_end_date: "2019-11-29",
            trial_length: 30,
            support_email: env_1.serverConfig.email.supportEmail,
            action_url: "https://someactionurl.com"
        });
        return res.status(201).send({
            user,
            token
        });
    }
    catch (error) {
        res.status(400).send({
            status: "error",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userCreationError"),
            details: error.message
        });
    }
}));
/*#############################################################|
|  >>> PROTECTED ROUTES
*##############################################################*/
// Authentication routes ========================================
// User ==> Logout
userRouter.post("/users/logout", auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const reqToken = req.token;
    try {
        // remove the token that's being used for the user from our user tokens array in our database
        user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== reqToken);
        console.log(`Logging out user: ${user.email}`);
        yield user.save(); // save user model to update records
        return res.status(200).send({
            status: "success",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userLogoutSuccess")
        });
    }
    catch (error) {
        return res.status(400).send({
            status: "error",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userLogoutError"),
            details: error.message
        });
    }
}));
// User ==> Logout all connected devices
userRouter.post("/users/logout/all", auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        user.tokens = [];
        yield user.save();
        return res.status(200).send({
            status: "success",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userLogoutAllSuccess")
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userLogoutAllError"),
            details: error.message
        });
    }
}));
// User ==> Upload profile picture
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
            return cb(new Error(LanguageHelper_1.LanguageHelper.getLanguageString("user", "userErrorFileUploadFormat", {
                format: "png or jpg"
            })));
        }
        cb(undefined, true); // acccept file callback
    }
});
// !upload-key should match postman's form-data key. set key as 'file' instead of text
userRouter.post("/profile/avatar", [auth_middleware_1.userAuthMiddleware, upload.single("avatar")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("uploading your file...");
    // here we're saving the file directly in our database
    const { user } = req;
    const { buffer } = req.file;
    // Let's use sharp library to change the file (crop, change format, etc)
    const editedImageBuffer = yield sharp_1.default(buffer)
        .resize({
        width: 250,
        height: 250
    })
        .png()
        .toBuffer();
    user.avatar = editedImageBuffer;
    yield user.save();
    return res.status(200).send({
        status: "success",
        message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userAvatarUploaded")
    });
}), (error, req, res, next) => {
    return res.status(500).send({
        status: "error",
        message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userAvatarErrorUpload"),
        details: error.message
    });
});
// CRUD routes ========================================
// User => Serve avatar picture ========================================
userRouter.get("/user/:id/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.params.id);
        if (!user || !user.avatar) {
            return res.status(500).send({
                status: "error",
                message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userAvatarUploadEmpty")
            });
        }
        res.set("Content-Type", "image/png");
        return res.send(user.avatar);
    }
    catch (error) {
        return res.status(404).send();
    }
}));
// User => Delete avatar picture ========================================
userRouter.delete("/users/profile/me", auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        user.avatar = undefined;
        user.save();
        return res.status(200).send({
            status: "success",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userAvatarUploadDeleted")
        });
    }
    catch (error) {
        res.status(400).send({
            status: "error",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userAvatarUploadDeletedError"),
            details: error.message
        });
    }
}));
// User ==> Delete your own account
userRouter.delete("/users/me", auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        yield user.remove();
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userDeleteError"),
            details: error.message
        });
    }
}));
userRouter.get("/users/profile", auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        return res.status(200).send({
            user
        }); // req.user is coming from the authMiddleware
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userProfileGetError"),
            details: error.message
        });
    }
}));
userRouter.patch("/users/me", auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const updates = Object.keys(req.body);
    if (!RouterHelper_1.RouterHelper.isAllowedKey(req.body, ["name", "email", "password", "age"])) {
        return res.status(400).send({
            status: "error",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userPatchForbiddenKeys")
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
            status: "error",
            message: LanguageHelper_1.LanguageHelper.getLanguageString("user", "userFailedUpdate"),
            details: error.message
        });
    }
}));
