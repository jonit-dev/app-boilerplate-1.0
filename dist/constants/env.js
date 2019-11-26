"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverConfig_dev_1 = require("./serverConfig.dev");
const serverConfig_prod_1 = require("./serverConfig.prod");
var EnvType;
(function (EnvType) {
    EnvType["Development"] = "Development";
    EnvType["Production"] = "Production";
    EnvType["Staging"] = "Staging";
})(EnvType = exports.EnvType || (exports.EnvType = {}));
exports.APP_NAME = "App Boilerplate";
exports.SUPPORT_EMAIL = "email@gmail.com";
exports.ENV = EnvType.Production; // Select which environment to use here (dev | prod)
exports.serverConfig = exports.ENV === EnvType.Development ? serverConfig_dev_1.devServerConfig : serverConfig_prod_1.prodServerConfig;
