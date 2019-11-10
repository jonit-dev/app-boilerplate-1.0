"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextHelper {
    static escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    }
    static replaceAll(str, find, replace) {
        return str.replace(new RegExp(TextHelper.escapeRegExp(find), 'g'), replace);
    }
}
exports.TextHelper = TextHelper;
TextHelper.capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
