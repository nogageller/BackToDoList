const { ObjectId } = require('mongodb');
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const { getCollectionOperations } = require('../db/connect')

const tasksOperations = getCollectionOperations(process.env.NODE_ENV === 'test' ? 'testTasks' : 'tasks')

const createTask = async (req, res) => {
    const { body } = req;
    const result = await tasksOperations.insertOne(body);
    return res.status(StatusCodes.CREATED).json(result);
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const result = await tasksOperations.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
    }

    return res.status(StatusCodes.OK).json(result);
};

const deleteDoneTask = async (req, res) => {
    const result = await tasksOperations.deleteMany({ isChecked: true });
    
    if (result.deletedCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
    }

    return res.status(StatusCodes.OK).json(result);
};

const getTasks = async (req, res) => {
    const tasks = await tasksOperations.find({});
    return res.status(StatusCodes.OK).json(tasks);
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const { name, subject, priority, isChecked } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (subject !== undefined) updateFields.subject = subject;
    if (priority !== undefined) updateFields.priority = priority;
    if (isChecked !== undefined) updateFields.isChecked = isChecked;

    const result = await tasksOperations.updateOne(
        { _id: objectId },
        { $set: updateFields }
    );

    if (result.matchedCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
    }

    return res.status(StatusCodes.OK).json(result);
};

module.exports = { createTask, deleteTask, deleteDoneTask, getTasks, updateTask };
