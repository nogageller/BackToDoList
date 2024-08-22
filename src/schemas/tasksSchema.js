const Joi = require('joi');

const taskSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    subject: Joi.string().max(100).required(),
    priority: Joi.number().integer().min(0).max(10).required(),
    isChecked: Joi.boolean().required()
}).strict();

const updateTaskSchema = Joi.object({
    name: Joi.string().min(3).max(50),
    subject: Joi.string().max(100),
    priority: Joi.number().integer().min(0).max(10),
    isChecked: Joi.boolean()
}).min(1).strict();

const subjectSchema = Joi.object({
    name: Joi.string().min(3).max(50).required()
}).strict();

const idSchema = Joi.object({
    id: Joi.string().length(24).hex().required()
});

module.exports = {
    taskSchema,
    subjectSchema,
    updateTaskSchema,
    idSchema
};
