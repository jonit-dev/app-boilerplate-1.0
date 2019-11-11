"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverConfig_dev_1 = require("./serverConfig.dev");
const serverConfig_prod_1 = require("./serverConfig.prod");
exports.appName = 'App Boilerplate';
exports.supportEmail = 'email@gmail.com';
exports.env = 'dev'; // Select which environment to use here (dev | prod)
exports.serverConfig = exports.env === 'dev' ? serverConfig_dev_1.devServerConfig : serverConfig_prod_1.prodServerConfig;
