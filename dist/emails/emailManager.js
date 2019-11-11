"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const fs_1 = require("fs");
const env_1 = require("../constants/env");
const TextHelper_1 = require("../utils/TextHelper");
var EmailType;
(function (EmailType) {
    EmailType["Html"] = "Html";
    EmailType["Text"] = "Text";
})(EmailType = exports.EmailType || (exports.EmailType = {}));
class EmailManager {
    constructor() {
        this._apiKey = env_1.serverConfig.email.sendGridAPIKey;
        this.sendGrid = mail_1.default;
        this.sendGrid.setApiKey(this._apiKey);
    }
    loadTemplate(type, template, customVars) {
        let extension;
        if (type === EmailType.Html) {
            extension = '.html';
        }
        else if (type === EmailType.Text) {
            extension = '.txt';
        }
        const data = fs_1.readFileSync(`${env_1.serverConfig.email.templatesFolder}/${template}/content${extension}`, 'utf-8').toString();
        return this.replaceTemplateCustomVars(data, customVars);
    }
    replaceTemplateCustomVars(html, customVars) {
        const keys = Object.keys(customVars);
        const globalKeys = Object.keys(env_1.serverConfig.email.globalTemplateVars);
        if (keys) {
            for (const key of keys) {
                html = TextHelper_1.TextHelper.replaceAll(html, `{{${key}}}`, customVars[key]);
            }
        }
        if (globalKeys) {
            for (const globalKey of globalKeys) {
                html = TextHelper_1.TextHelper.replaceAll(html, `[${globalKey}]`, env_1.serverConfig.email.globalTemplateVars[globalKey]);
            }
        }
        return html;
    }
}
exports.EmailManager = EmailManager;
