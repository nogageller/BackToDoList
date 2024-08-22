const { subjectSchema } = require('../schemas/subjectSchema');
const HttpStatus = require('../enums/responseSatus.js');

// Middleware to validate subject creation and update
const validateSubject = (req, res, next) => {
    const { error } = subjectSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });
    if (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid request data', details: error.details });
    }
    next();
};

module.exports = {
    validateSubject
};