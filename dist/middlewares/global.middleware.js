"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LanguageHelper_1 = __importDefault(require("../utils/LanguageHelper"));
const checkMethods = (req, res, next) => {
    const { method, path } = req;
    if (method === 'GET') {
        return res.status(401).send({
            status: 'error',
            message: LanguageHelper_1.default.getLanguageString(null, 'methodNotAllowed')
        });
    }
    else {
        console.log(`Express Middleware => ${method} / ${path}`);
        next();
    }
};
exports.checkMethods = checkMethods;
const maintenanceMode = (req, res, next) => {
    return res.status(503).send({
        status: 'error',
        message: LanguageHelper_1.default.getLanguageString(null, 'appMaintenanceMode')
    });
};
exports.maintenanceMode = maintenanceMode;
