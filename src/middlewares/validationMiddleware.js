const { StatusCodes } = require('http-status-codes');

const validateSchema = (schema, validateType = 'body') => (req, res, next) => {
    const data = validateType === 'body' ? req.body : req.params;
    const { error } = schema.validate(data, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Invalid request data',
            details: error.details
        });
    }

    next();
};

module.exports = {
    validateSchema
};