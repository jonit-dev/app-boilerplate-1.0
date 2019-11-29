"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
class MainCron {
    static sampleCron() {
        console.log("starting MainCron...");
        node_cron_1.default.schedule("* * * * *", function () {
            console.log("This is a cron sample");
        });
    }
}
exports.MainCron = MainCron;
