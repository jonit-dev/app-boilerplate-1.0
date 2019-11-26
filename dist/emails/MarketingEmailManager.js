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
const mailchimp_api_v3_1 = __importDefault(require("mailchimp-api-v3"));
const env_1 = require("../constants/env");
class MarketingEmailManager {
    constructor() {
        this._mailchimpApiKey = env_1.serverConfig.email.mailchimpAPIKey;
        this.mailchimp = new mailchimp_api_v3_1.default(env_1.serverConfig.email.mailchimpAPIKey);
        this.lists = {
            default: env_1.serverConfig.email.mailchimpDefaultList
        };
    }
    subscribe(email, callback, listId = this.lists.default) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (env_1.ENV) {
                case env_1.EnvType.Staging:
                case env_1.EnvType.Development:
                    console.log(`Skipping adding new lead (${email}) to e-mail list (${listId}) under apiKey ${this._mailchimpApiKey}. Function only available in production`);
                    break;
                case env_1.EnvType.Production:
                    console.log(`adding new lead (${email}) to e-mail list (${listId}) under apiKey ${this._mailchimpApiKey}`);
                    const payload = {
                        members: [
                            {
                                email_address: email,
                                email_type: "text",
                                status: "subscribed"
                            }
                        ]
                    };
                    yield this.mailchimp.post(`/lists/${listId}`, payload, () => {
                        if (callback) {
                            callback();
                        }
                    });
                    break;
            }
        });
    }
}
exports.MarketingEmailManager = MarketingEmailManager;
