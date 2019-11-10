"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverConfig_1 = require("../constants/serverConfig");
const global_lang_1 = require("../lang/global.lang");
const TextHelper_1 = require("../utils/TextHelper");
// load proper language strings, accordingly to the server language settings
class LanguageHelper {
}
exports.LanguageHelper = LanguageHelper;
LanguageHelper.getLanguageString = (model = null, key, customVars = {}) => {
    if (!model) {
        // pass only the global strings
        return global_lang_1.globalStrings[key][serverConfig_1.serverConfig.language];
    }
    // load language strings for a specific model
    const { strings } = require(`../resources/${TextHelper_1.TextHelper.capitalizeFirstLetter(model)}/${model}.lang.ts`);
    // add our global generic strings
    const languageStrings = Object.assign(Object.assign({}, strings), global_lang_1.globalStrings);
    let string = languageStrings[key][serverConfig_1.serverConfig.language];
    const customVarsKeys = Object.keys(customVars);
    if (customVarsKeys) {
        for (const k of customVarsKeys) {
            string = string.replace(new RegExp(`{{${k}}}`, 'g'), customVars[k]);
        }
    }
    return string;
};
