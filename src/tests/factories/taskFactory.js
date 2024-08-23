const { ObjectId } = require('mongodb');

const createTaskFactory = async (db, taskData = {}) => {
    const defaultTask = {
        name: 'Default Task',
        subject: 'General',
        priority: 5,
        isChecked: false,
    };

    const task = { ...defaultTask, ...taskData };
    const result = await db.collection('testTasks').insertOne(task);

    // After inserting task
    const tasks = await db.collection('testTasks').find({}).toArray();
    console.log('Tasks in DB:', tasks);
    
    return result.insertedId;
};

module.exports = createTaskFactory;