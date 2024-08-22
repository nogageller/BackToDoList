const { taskSchema, updateTaskSchema } = require('../schemas/tasksSchema');
const HttpStatus = require('../enums/responseSatus.js');

// Middleware to validate task creation
const validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body, {
        abortEarly: false, 
        allowUnknown: false 
    });
    if (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid request data', details: error.details });
    }
    next();
};

// Middleware to validate task update
const validateUpdateTask = (req, res, next) => {
    const { error } = updateTaskSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });
    if (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid update data', details: error.details });
    }
    next();
};

module.exports = {
    validateTask,
    validateUpdateTask
};