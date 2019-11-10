"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const fs_1 = require("fs");
const serverConfig_1 = require("../constants/serverConfig");
const TextHelper_1 = require("../utils/TextHelper");
class EmailManager {
    constructor() {
        this.apiKey = serverConfig_1.serverConfig.email.sendGridAPIKey;
        this.sendGrid = mail_1.default;
        this.sendGrid.setApiKey(this.apiKey);
    }
    loadTemplate(template, customVars) {
        const html = fs_1.readFileSync(`${serverConfig_1.serverConfig.email.templatesFolder}/${template}/content.html`, 'utf-8').toString();
        return this.replaceTemplateCustomVars(html, customVars);
    }
    replaceTemplateCustomVars(html, customVars) {
        const keys = Object.keys(customVars);
        const globalKeys = Object.keys(serverConfig_1.serverConfig.email.globalTemplateVars);
        if (keys) {
            for (const key of keys) {
                html = TextHelper_1.TextHelper.replaceAll(html, `{{${key}}}`, customVars[key]);
            }
        }
        if (globalKeys) {
            for (const globalKey of globalKeys) {
                html = TextHelper_1.TextHelper.replaceAll(html, `[${globalKey}]`, serverConfig_1.serverConfig.email.globalTemplateVars[globalKey]);
            }
        }
        return html;
    }
}
exports.EmailManager = EmailManager;
