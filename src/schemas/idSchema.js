const Joi = require('joi');

const idSchema = Joi.object({
    id: Joi.string().length(24).hex()
});

module.exports = {
    idSchema
};
