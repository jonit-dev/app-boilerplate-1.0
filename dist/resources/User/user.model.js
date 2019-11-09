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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const serverConfig_1 = require("../../constants/serverConfig");
const LanguageHelper_1 = require("../../utils/LanguageHelper");
// Statics ========================================
const userSchema = new mongoose_1.Schema({
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
        // this will allow multi device sign in (different devices with different tokens)
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});
// statics are methods that you add to your model, making it possible to access them anywhere
userSchema.statics.hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return bcryptjs_1.default.hash(password, 8);
});
// methods create a normal method (instance needs to be declared). Statics functions, otherwise, doesn't need to be declared. It can be accessed directly through the model
// here we use function() instead of an arrow function because we need access to "this", that's not present on the later.
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, serverConfig_1.serverConfig.jwtSecret);
        // we can also pass an optional configuration object
        // const token = jwt.sign({ _id: user._id.toString() }, serverConfig.jwtSecret), { expiresIn: '7 days'});
        user.tokens = [...user.tokens, { token }];
        yield user.save();
        return token;
    });
};
// this will be fired whenever our model is converted to JSON!!
userSchema.methods.toJSON = function () {
    // delete keys that shouldn't be displayed publicly
    const user = this;
    const userObject = user.toObject(); // convert Mongoose model to Object
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};
userSchema.statics.findByCredentials = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ email });
    if (!user) {
        throw new Error(LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userNotFoundOnLogin'));
    }
    // if our provided password is equal to the stored password
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error(LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userWrongPassword'));
    }
    return user; // return the user if everything is ok
});
/*#############################################################|
|  >>> MODEL MIDDLEWARES
*##############################################################*/
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // console.log('user :: middleware => Running pre "save" code');
        // this is the document being saved
        // check if password was modified (updated or created)
        if (user.isModified('password')) {
            user.password = yield userSchema.statics.hashPassword(user.password);
        }
        next(); // proceed...
    });
});
// model ========================================
const User = mongoose_1.model('User', userSchema);
exports.User = User;
