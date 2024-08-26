const { ObjectId } = require('mongodb');
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

const createSubject = async (req, res) => {
    try {
        const { body } = req;
        const result = await req.collectionOperations.insertOne(body);
        return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        console.error('Error adding subject:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error adding subject', error });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const objectId = new ObjectId(id);
        const result = await req.collectionOperations.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Subject not found' });
        }

        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting subject', error });
    }
};

const getSubjects = async (req, res) => {
    try {
        const subjects = await req.collectionOperations.find({});
        return res.status(StatusCodes.OK).json(subjects);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error getting subjects', error });
    }
};

const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const objectId = new ObjectId(id);
        const { name } = req.body;

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;

        const result = await req.collectionOperations.updateOne(
            { _id: objectId },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Subject not found' });
        }

        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating subject', error });
    }
};

module.exports = { createSubject, deleteSubject, getSubjects, updateSubject };
