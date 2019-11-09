"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const global_1 = require("../../types/global");
const LanguageHelper_1 = require("../../utils/LanguageHelper");
const RouterHelper_1 = require("../../utils/RouterHelper");
const task_model_1 = require("./task.model");
/*#############################################################|
|  >>> PROTECTED ROUTES
*##############################################################*/
// @ts-ignore
const taskRouter = new express_1.default.Router();
exports.taskRouter = taskRouter;
taskRouter.post('/tasks', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    try {
        const task = new task_model_1.Task(Object.assign(Object.assign({}, req.body), { owner: user._id // associate task with owner
         }));
        yield task.save();
        return res.status(201).send(task);
    }
    catch (error) {
        return res.status(400).send({
            status: 'error',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('task', 'taskCreationError'),
            details: error.message
        });
    }
}));
taskRouter.patch('/tasks/:id', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updates = Object.keys(req.body);
    try {
        // validate for forbidden keys
        if (!RouterHelper_1.RouterHelper.isAllowedKey(req.body, ['completed', 'description'])) {
            return res.status(404).send({
                status: 'error',
                message: LanguageHelper_1.LanguageHelper.getLanguageString('task', 'taskPatchForbiddenKeys')
            });
        }
        const task = yield task_model_1.Task.findById(id);
        // update every key on the user object
        updates.forEach(update => {
            task[update] = req.body[update];
        });
        yield task.save();
        // const task = await Task.findByIdAndUpdate(id, req.body, {
        //   new: true, //return updated user
        //   runValidators: true //run our standard validators on update
        // });
        if (!task) {
            return res.status(404).send({
                status: 'error',
                message: LanguageHelper_1.LanguageHelper.getLanguageString('task', 'taskNotFound')
            });
        }
        return res.status(200).send(task);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
taskRouter.get('/tasks', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    let sortParam;
    let conditions = {};
    if (query.description) {
        conditions = Object.assign(Object.assign({}, conditions), { description: query.description });
    }
    if (query.completed) {
        conditions = Object.assign(Object.assign({}, conditions), { completed: query.completed });
    }
    if (query.sortBy) {
        const queryData = query.sortBy.split('_');
        const sortByParam = queryData[0];
        const orderBy = queryData[1];
        sortParam =
            orderBy === global_1.SortOrderType.Desc ? `-${sortByParam}` : sortByParam;
    }
    try {
        const tasks = yield task_model_1.Task.find(conditions)
            .skip(parseInt(query.skip))
            .limit(parseInt(query.limit))
            .sort(sortParam);
        if (!tasks) {
            return res.status(404).send({
                status: 'error',
                message: LanguageHelper_1.LanguageHelper.getLanguageString('task', 'tasksNotFound')
            });
        }
        return res.status(200).send(tasks);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
// number of complete tasks (promise chaining sample)
taskRouter.get('/tasks/completed', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_model_1.Task.find({ completed: true });
        if (!tasks) {
            return res.status(404).send({
                status: 'error',
                message: LanguageHelper_1.LanguageHelper.getLanguageString('task', 'taskNoCompletedTasksFound')
            });
        }
        const count = yield task_model_1.Task.countDocuments({ completed: true });
        return res.status(200).send({
            numberOfTasks: count,
            tasks
        });
    }
    catch (error) {
        return res.status(400).send(error);
    }
    // Task.find({ completed: true })
    //   .then(tasks => {
    //     if (!tasks) {
    //       return res.status(404).send({
    //         status: "error",
    //         message: "No tasks found"
    //       });
    //     }
    //     return Task.countDocuments({ completed: true });
    //   })
    //   .then(count => {
    //     return res.status(200).send({
    //       numberOfTasks: count
    //     });
    //   })
    //   .catch(err => {
    //     return res.status(400).send(err);
    //   });
}));
taskRouter.get('/tasks/:id', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const task = yield task_model_1.Task.findById(id);
        if (!task) {
            return res.status(404).send({
                status: 'error',
                message: LanguageHelper_1.LanguageHelper.getLanguageString('task', 'tasksNotFound')
            });
        }
        return res.status(200).send(task);
    }
    catch (error) {
        return res.status(400).send(error);
    }
}));
taskRouter.delete('/tasks/:id', auth_middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const task = yield task_model_1.Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(400).send({
                status: 'error',
                message: LanguageHelper_1.LanguageHelper.getLanguageString('task', 'taskDeleteNotFound')
            });
        }
        const count = yield task_model_1.Task.countDocuments({ completed: false });
        return res.status(200).send({
            status: 'success',
            message: LanguageHelper_1.LanguageHelper.getLanguageString('task', 'taskDeletedSuccessfully'),
            tasksLeft: count
        });
    }
    catch (error) {
        return res.status(400).send(error);
    }
}));
