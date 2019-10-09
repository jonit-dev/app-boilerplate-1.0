"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAllowedKey = (requestBody, allowedUpdatesKeys) => {
    const updates = Object.keys(requestBody);
    return updates.every(update => allowedUpdatesKeys.includes(update));
};
exports.isAllowedKey = isAllowedKey;
