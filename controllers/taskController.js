import mongoose from 'mongoose';
import Task from '../models/Task.js';

function getTaskFields(body) {
    return {
        title: typeof body.title === 'string' ? body.title.trim() : '',
        description: typeof body.description === 'string' ? body.description.trim() : '',
    };
}

function isValidTaskId(id) {
    return mongoose.isObjectIdOrHexString(id);
}

export async function listTasks(req, res) {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render('list', { tasks });
}

export async function createTask(req, res) {
    const fields = getTaskFields(req.body);
    if (!fields.title) {
        return res.status(400).render('add', {
            error: 'Task title is required.',
            task: fields,
        });
    }

    await Task.create(fields);
    res.redirect('/');
}

export async function renderEditTask(req, res) {
    if (!isValidTaskId(req.params.id)) {
        return res.status(404).send('Task not found.');
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).send('Task not found.');
    }

    res.render('update', { task, error: null });
}

export async function updateTask(req, res) {
    if (!isValidTaskId(req.params.id)) {
        return res.status(404).send('Task not found.');
    }

    const fields = getTaskFields(req.body);
    if (!fields.title) {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found.');
        }

        return res.status(400).render('update', {
            task: { ...fields, _id: task._id },
            error: 'Task title is required.',
        });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, fields, {
        new: true,
        runValidators: true,
    });
    if (!task) {
        return res.status(404).send('Task not found.');
    }

    res.redirect('/');
}

export async function deleteTask(req, res) {
    if (!isValidTaskId(req.params.id)) {
        return res.status(404).send('Task not found.');
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
        return res.status(404).send('Task not found.');
    }

    res.redirect('/');
}
