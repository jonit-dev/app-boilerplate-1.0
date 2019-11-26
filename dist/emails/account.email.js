"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../constants/env");
const TransactionalEmailManager_1 = require("./TransactionalEmailManager");
class AccountEmailManager extends TransactionalEmailManager_1.TransactionalEmailManager {
    newAccount(to, subject, template, customVars) {
        switch (env_1.ENV) {
            case env_1.EnvType.Development:
            case env_1.EnvType.Staging:
                console.log("Skipping sending new account email... Option only available in production.");
                break;
            case env_1.EnvType.Production:
                console.log("Sending new account email...");
                const htmlEmail = this.loadTemplate(TransactionalEmailManager_1.EmailType.Html, template, customVars);
                const textEmail = this.loadTemplate(TransactionalEmailManager_1.EmailType.Text, template, customVars);
                this.sendGrid.send({
                    to,
                    from: env_1.serverConfig.email.supportEmail,
                    subject,
                    html: htmlEmail,
                    text: textEmail
                });
                break;
        }
    }
}
exports.AccountEmailManager = AccountEmailManager;
