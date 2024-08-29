const { ObjectId } = require('mongodb');
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const { getCollectionOperations } = require('../db/connect')

const subjectsOperations = getCollectionOperations(process.env.NODE_ENV === 'test' ? 'testSubjects' : 'subjects');

const createSubject = async (req, res) => {
    const { body } = req;
    const result = await subjectsOperations.insertOne(body);
    return res.status(StatusCodes.CREATED).json(result);
};

const deleteSubject = async (req, res) => {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const result = await subjectsOperations.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Subject not found' });
    }

    return res.status(StatusCodes.OK).json(result);
};

const getSubjects = async (req, res) => {
    const subjects = await subjectsOperations.find({});
    return res.status(StatusCodes.OK).json(subjects);
};

const updateSubject = async (req, res) => {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const { name } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;

    const result = await subjectsOperations.updateOne(
        { _id: objectId },
        { $set: updateFields }
    );

    if (result.matchedCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Subject not found' });
    }

    return res.status(StatusCodes.OK).json(result);
};

module.exports = { createSubject, deleteSubject, getSubjects, updateSubject };
