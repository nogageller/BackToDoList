const { ObjectId } = require('mongodb');
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

const createTask = async (req, res) => {
    const { body } = req;
    const result = await req.collectionOperations.insertOne(body);
    return res.status(StatusCodes.CREATED).json(result);
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const result = await req.collectionOperations.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
    }

    return res.status(StatusCodes.OK).json(result);
};

const getTasks = async (req, res) => {
    const tasks = await req.collectionOperations.find({});
    return res.status(StatusCodes.OK).json(tasks);
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const { name, subject, priority, completed } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (subject !== undefined) updateFields.subject = subject;
    if (priority !== undefined) updateFields.priority = priority;
    if (completed !== undefined) updateFields.completed = completed;

    const result = await req.collectionOperations.updateOne(
        { _id: objectId },
        { $set: updateFields }
    );

    if (result.matchedCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
    }

    return res.status(StatusCodes.OK).json(result);
};

module.exports = { createTask, deleteTask, getTasks, updateTask };
