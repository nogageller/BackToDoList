const Joi = require('joi');

const subjectSchema = Joi.object({
    name: Joi.string().min(3).max(50).required()
}).strict();

const updateSubjectSchema = Joi.object({
    name: Joi.string().min(3).max(50),
}).min(1).strict();

module.exports = {
    subjectSchema,
    updateSubjectSchema
};
