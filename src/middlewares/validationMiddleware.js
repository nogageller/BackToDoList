const { StatusCodes } = require('http-status-codes');

const validateSchema = (schema, validateType = 'body') => (req, res, next) => {
    const data = validateType === 'body' ? req.body : req.params;
    const { error } = schema.validate(data, {
        abortEarly: true,
        allowUnknown: false
    });

    if (error) {
        const validationError = new Error('Invalid request data');
        validationError.status = StatusCodes.BAD_REQUEST;
        throw validationError;
    }

    next();
};

module.exports = {
    validateSchema
};