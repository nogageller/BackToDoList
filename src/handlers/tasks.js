const { ObjectId } = require('mongodb');
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');


const taskHandler = {
    createTask: async (req, res) => {
        try {
            const { body } = req;
            const result = await req.collectionOperations.insertOne(body);
            return res.status(StatusCodes.CREATED).json(result);
        } catch (error) {
            console.error('Error adding task:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error adding task', error });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const { id } = req.params;
            const objectId = new ObjectId(id);
            const result = await req.collectionOperations.deleteOne({ _id: objectId });

            if (result.deletedCount === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
            }

            return res.status(StatusCodes.OK).json(result);
        } catch (error) {
            console.error('Error adding task:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting task', error });
        }
    }, 

    getTasks: async(req, res) => {
        try {
            const tasks = await req.collectionOperations.find({});
            return res.status(StatusCodes.OK).json(tasks);
        } catch (error) {
            console.error('Error adding task:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error geting tasks', error });
        }
    },

    updateTask: async(req, res) =>{
        try {
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
        } catch (error) {
            console.error('Error adding task:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating task', error });
        }

    }
}

module.exports = taskHandler;