const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');
const { StatusCodes } = require('http-status-codes');
const taskRouter = require('../routes/tasks.js');
const createTaskFactory = require('./factories/taskFactory.js');
const { connectDB, getCollectionOperations, closeDB } = require('../db/connect.js');

process.env.NODE_ENV = 'test';

const app = express();
app.use(express.json());
app.use('/tasks', taskRouter);

const testOperations = getCollectionOperations('testTasks');

beforeAll(async () => {
    await connectDB()
});

afterAll(async () => {
    await closeDB()
});

beforeEach(async () => {
    console.log('Clearing collection');
    await testOperations.deleteMany({});
    // After deleting tasks
    const tasks = await testOperations.find({});
    console.log('Tasks in DB after cleanup:', tasks);
});

describe('Task Routes', () => {
    it('should create a task', async () => {
        const task = {
            name: 'Test Task',
            subject: 'Testing',
            priority: 10,
            isChecked: false,
        };

        const response = await request(app).post('/tasks').send(task);

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).toHaveProperty('insertedId');
    });

    it('should get all tasks', async () => {
        await createTaskFactory(testOperations, {
            name: 'Test Task',
            subject: 'Testing',
            priority: 1,
            isChecked: false,
        });

        const response = await request(app).get('/tasks');

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveLength(1);
    });

    it('should update a task', async () => {
        const taskId = await createTaskFactory(testOperations, {
            name: 'Old Task',
            subject: 'Testing',
            priority: 2,
            isChecked: false,
        });

        const response = await request(app)
            .put(`/tasks/${taskId}`)
            .send({ name: 'Updated Task', priority: 10 });

        expect(response.status).toBe(StatusCodes.OK);

        const updatedTask = await testOperations.findOne({ _id: taskId });
        expect(updatedTask.name).toBe('Updated Task');
        expect(updatedTask.priority).toBe(10);
    });

    it('should delete a task', async () => {
        const taskId = await createTaskFactory(testOperations, {
            name: 'Task to Delete',
            subject: 'Testing',
            priority: 4,
            isChecked: false,
        });

        const response = await request(app).delete(`/tasks/${taskId}`);

        expect(response.status).toBe(StatusCodes.OK);

        const deletedTask = await testOperations.findOne({ _id: taskId });
        expect(deletedTask).toBeNull();
    });

    it('should delete all done tasks', async () => {
        const taskId = await createTaskFactory(testOperations, {
            name: 'Task to Delete',
            subject: 'Testing',
            priority: 4,
            isChecked: true,
        });

        const response = await request(app).delete(`/tasks/deleteDone`);

        expect(response.status).toBe(StatusCodes.OK);

        const deletedTask = await testOperations.findOne({ _id: taskId });
        expect(deletedTask).toBeNull();
    });

    it('should return 404 for non-existent task on update', async () => {
        const fakeId = new ObjectId().toString(); 

        const response = await request(app)
            .put(`/tasks/${fakeId}`)
            .send({ name: 'Updated Task' });

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 404 for non-existent task on delete', async () => {
        const fakeId = new ObjectId().toString(); 

        const response = await request(app).delete(`/tasks/${fakeId}`);

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 400 for another task parameter which is not allowed', async () => {
        const task = {
            name: 'Test Task',
            subject: 'Testing',
            priority: 10,
            isChecked: false,
            date: 10,
        };

        const response = await request(app).post('/tasks').send(task);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
});

