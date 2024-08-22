const Joi = require('joi');

const subjectSchema = Joi.object({
    name: Joi.string().min(3).max(50).required()
}).strict();

module.exports = {
    subjectSchema
};
