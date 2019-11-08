import express from 'express';
import { userAuthMiddleware } from '../../middlewares/auth.middleware';
import LanguageHelper from '../../utils/LanguageHelper';
import RouterHelper from '../../utils/RouterHelper';
import Task from './task.model';

/*#############################################################|
|  >>> PROTECTED ROUTES
*##############################################################*/

// @ts-ignore
const router = new express.Router();

router.post('/tasks', userAuthMiddleware, async (req, res) => {
  const { user } = req;

  try {
    const task = new Task({
      ...req.body,
      owner: user._id // associate task with owner
    });
    await task.save();

    return res.status(201).send(task);
  } catch (error) {
    return res.status(400).send({
      status: 'error',
      message: LanguageHelper.getLanguageString('task', 'taskCreationError'),
      details: error.message
    });
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = Object.keys(req.body);

  try {
    // validate for forbidden keys
    if (!RouterHelper.isAllowedKey(req.body, ['completed', 'description'])) {
      return res.status(404).send({
        status: 'error',
        message: LanguageHelper.getLanguageString(
          'task',
          'taskPatchForbiddenKeys'
        )
      });
    }

    const task: any = await Task.findById(id);

    // update every key on the user object
    updates.forEach(update => {
      task[update] = req.body[update];
    });
    await task.save();

    // const task = await Task.findByIdAndUpdate(id, req.body, {
    //   new: true, //return updated user
    //   runValidators: true //run our standard validators on update
    // });

    if (!task) {
      return res.status(404).send({
        status: 'error',
        message: LanguageHelper.getLanguageString('task', 'taskNotFound')
      });
    }

    return res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', async (req, res) => {
  const tasks = await Task.find({});

  try {
    if (!tasks) {
      return res.status(404).send({
        status: 'error',
        message: LanguageHelper.getLanguageString('task', 'tasksNotFound')
      });
    }
    return res.status(200).send(tasks);
  } catch (error) {
    return res.status(500).send(error);
  }

  // Task.find({})
  //   .then(results => {
  //     if (!results) {
  //       return res.status(404).send({
  //         status: "error",
  //         message: "Tasks not found!"
  //       });
  //     }

  //     return res.status(200).send(results);
  //   })
  //   .catch(err => res.status(500).send());
});

// number of complete tasks (promise chaining sample)

router.get('/tasks/completed', async (req, res) => {
  try {
    const tasks = await Task.find({ completed: true });
    if (!tasks) {
      return res.status(404).send({
        status: 'error',
        message: LanguageHelper.getLanguageString(
          'task',
          'taskNoCompletedTasksFound'
        )
      });
    }

    const count = await Task.countDocuments({ completed: true });

    return res.status(200).send({
      numberOfTasks: count,
      tasks
    });
  } catch (error) {
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
});

router.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).send({
        status: 'error',
        message: LanguageHelper.getLanguageString('task', 'tasksNotFound')
      });
    }

    return res.status(200).send(task);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(400).send({
        status: 'error',
        message: LanguageHelper.getLanguageString('task', 'taskDeleteNotFound')
      });
    }

    const count = await Task.countDocuments({ completed: false });

    return res.status(200).send({
      status: 'success',
      message: LanguageHelper.getLanguageString(
        'task',
        'taskDeletedSuccessfully'
      ),
      tasksLeft: count
    });
  } catch (error) {
    return res.status(400).send(error);
  }
});

export default router;
