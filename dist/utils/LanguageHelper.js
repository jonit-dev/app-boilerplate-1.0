"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverConfig_1 = __importDefault(require("../constants/serverConfig"));
const global_lang_1 = __importDefault(require("../lang/global.lang"));
const TextHelper_1 = __importDefault(require("../utils/TextHelper"));
// load proper language strings, accordingly to the server language settings
const getLanguageString = (model = null, key) => {
    if (!model) {
        // pass only the global strings
        return global_lang_1.default[key][serverConfig_1.default.language];
    }
    // load language strings for a specific model
    let languageStrings = require(`../resources/${TextHelper_1.default.capitalizeFirstLetter(model)}/${model}.lang.ts`);
    // add our global generic strings
    languageStrings = Object.assign(Object.assign({}, languageStrings), global_lang_1.default);
    return languageStrings[key][serverConfig_1.default.language];
};
exports.default = { getLanguageString };
