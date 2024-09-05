const _ = require('lodash');
const { getCollectionOperations } = require('../../db/connect');

const tasksOperations = getCollectionOperations('testTasks');

const createTaskFactory = async (taskData = {}) => {
    const defaultTask = {
        name: 'Default Task',
        subject: 'General',
        priority: 5,
        isChecked: false,
    };

    const task = _.merge({}, defaultTask, taskData);
    const result = await tasksOperations.insertOne(task);
    
    return result.insertedId;
};

module.exports = createTaskFactory;