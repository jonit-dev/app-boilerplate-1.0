"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextHelper {
}
exports.TextHelper = TextHelper;
TextHelper.capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
