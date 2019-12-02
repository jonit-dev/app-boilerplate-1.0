"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const logSchema = new mongoose_1.Schema({
    action: {
        type: String
    },
    emitter: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    target: {
        type: mongoose_1.Schema.Types.ObjectId
    }
}, {
    timestamps: true
});
exports.Log = mongoose_1.model("Log", logSchema);
