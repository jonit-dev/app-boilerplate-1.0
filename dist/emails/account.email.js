"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../constants/env");
const emailManager_1 = require("./emailManager");
class AccountEmailManager extends emailManager_1.EmailManager {
    newAccount(to, subject, template, customVars) {
        console.log('Sending new account email...');
        const htmlEmail = this.loadTemplate(emailManager_1.EmailType.Html, template, customVars);
        const textEmail = this.loadTemplate(emailManager_1.EmailType.Text, template, customVars);
        this.sendGrid.send({
            to,
            from: env_1.serverConfig.email.supportEmail,
            subject,
            html: htmlEmail,
            text: textEmail
        });
    }
}
exports.AccountEmailManager = AccountEmailManager;
