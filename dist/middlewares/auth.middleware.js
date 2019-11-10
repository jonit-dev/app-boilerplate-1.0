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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const serverConfig_1 = require("../constants/serverConfig");
const user_model_1 = require("../resources/User/user.model");
const LanguageHelper_1 = require("../utils/LanguageHelper");
const userAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('Authorization').replace('Bearer ', ''); // remove Bearer string
        const decoded = jsonwebtoken_1.default.verify(token, serverConfig_1.serverConfig.jwtSecret);
        // find an user with the correct id (passed through the token), that has the particular token stored.
        const user = yield user_model_1.User.findOne({
            _id: decoded._id,
            'tokens.token': token
        });
        if (!user) {
            return res.status(401).send({
                status: 'error',
                message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userNotFoundByToken')
            });
        }
        req.token = token;
        req.user = user;
        // proceed with user access
        next();
    }
    catch (error) {
        return res.status(401).send({
            status: 'error',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('user', 'userNotAuthenticated')
        });
    }
});
exports.userAuthMiddleware = userAuthMiddleware;
