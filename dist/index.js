"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const serverConfig_1 = require("./constants/serverConfig");
const global_middleware_1 = require("./middlewares/global.middleware");
const task_routes_1 = require("./resources/Task/task.routes");
const user_routes_1 = require("./resources/User/user.routes");
mongoose_1.default.connect('mongodb://127.0.0.1:27017/task-manager-api', {
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
if (serverConfig_1.serverConfig.maintenanceMode) {
    app.use(global_middleware_1.GlobalMiddleware.maintenanceMode);
}
// app.use(middleware.checkMethods);
/*#############################################################|
|  >>> ROUTES
*##############################################################*/
// USERS ========================================
app.use(user_routes_1.userRouter);
// TASKS ========================================
app.use(task_routes_1.taskRouter);
app.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log(`Server is running on port ${port}`);
});
process.on('SIGINT', () => {
    console.log('Bye bye!');
    process.exit();
});
