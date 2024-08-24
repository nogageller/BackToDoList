const { idSchema } = require('../schemas/idSchema');
const { StatusCodes } = require('http-status-codes');

// Middleware to validate task ID
const validateId = (req, res, next) => {
    const { error } = idSchema.validate(req.params);
    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid ID format', details: error.details });
    }
    next();
};

module.exports = {
    validateId
};