"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const serverConfig_1 = __importDefault(require("./constants/serverConfig"));
mongoose_1.default.connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
/*#############################################################|
|  >>> EXPRESS - INITIALIZATION
*##############################################################*/
const app = express_1.default();
const port = process.env.PORT || 3000;
app.use(express_1.default.json()); // << THIS IS REQUIRED TO EXPRESS PARSING JSON DATA
/*#############################################################|
|  >>> MIDDLEWARES
*##############################################################*/
const global_middleware_1 = require("./middlewares/global.middleware");
if (serverConfig_1.default.maintenanceMode) {
    app.use(global_middleware_1.maintenanceMode);
}
const userRoutes = require("./resources/User/user.routes");
const taskRoutes = require("./resources/Task/task.routes");
// USERS ========================================
app.use(userRoutes);
// TASKS ========================================
app.use(taskRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
