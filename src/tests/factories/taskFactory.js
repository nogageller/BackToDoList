const _ = require('lodash');

const createTaskFactory = async (testOperations, taskData = {}) => {
    const defaultTask = {
        name: 'Default Task',
        subject: 'General',
        priority: 5,
        isChecked: false,
    };

    const task = _.merge({}, defaultTask, taskData);
    const result = await testOperations.insertOne(task);
    
    return result.insertedId;
};

module.exports = createTaskFactory;