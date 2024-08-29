
const createTaskFactory = async (testOperations, taskData = {}) => {
    const defaultTask = {
        name: 'Default Task',
        subject: 'General',
        priority: 5,
        isChecked: false,
    };

    const task = { ...defaultTask, ...taskData };
    const result = await testOperations.insertOne(task);

    const tasks = await testOperations.find({});
    console.log('Tasks in DB:', tasks);
    
    return result.insertedId;
};

module.exports = createTaskFactory;