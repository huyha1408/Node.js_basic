const express= require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth');

//API create task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

//API read all task
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});

//API read a task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {

        const task = await Task.findOne({ id, owner: req.user._id });;

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }

});

//API update task
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body); //get all key of JSON request's body
    const allowedUpdates = ['description', 'completed']; //all field of Task model allowed to update
    const isValidOperation = updates.every(update => allowedUpdates.includes(update)) //check every field valid

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'});
    }

    try {
        const task = await Task.findById(req.params.id);

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

//API delete task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;