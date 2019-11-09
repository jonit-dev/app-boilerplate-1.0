"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RouterHelper {
}
exports.RouterHelper = RouterHelper;
RouterHelper.isAllowedKey = (requestBody, allowedUpdatesKeys) => {
    const updates = Object.keys(requestBody);
    return updates.every(update => allowedUpdatesKeys.includes(update));
};
