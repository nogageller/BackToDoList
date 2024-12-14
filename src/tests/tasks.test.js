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

const tasksOperations = getCollectionOperations('testTasks');

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await closeDB();
});

beforeEach(async () => {
    console.log('Clearing collection');
    await tasksOperations.deleteMany({});
});

describe('Task Routes', () => {

    describe('POST', () => {
        it('should create a task', async () => {
            const task = {
                name: 'Test Task',
                subject: 'Testing',
                priority: 10,
                isChecked: false,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454] 
                },
            };

            const response = await request(app).post('/tasks').send(task);

            expect(response.status).toBe(StatusCodes.CREATED);
            expect(response.body).toHaveProperty('insertedId');
        });

        it('should return 400 for another task parameter which is not allowed', async () => {
            const task = {
                name: 'Test Task',
                subject: 'Testing',
                priority: 10,
                isChecked: false,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
                date: 10,
            };

            const response = await request(app).post('/tasks').send(task);

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        });
    });

    describe('GET', () => {
        it('should get all tasks', async () => {
            await createTaskFactory({
                name: 'Test Task',
                subject: 'Testing',
                priority: 1,
                isChecked: false,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });

            const response = await request(app).get('/tasks');

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).toHaveLength(1);
        });

        it('should filter tasks based on search query', async () => {
            await createTaskFactory({
                name: 'Test Task',
                subject: 'Testing',
                priority: 1,
                isChecked: false,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });
            await createTaskFactory({
                name: 'Another Task',
                subject: 'Testing',
                priority: 2,
                isChecked: true,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });

            const response = await request(app).get('/tasks?search=Test');

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].name).toBe('Test Task');
        });

        it('should return empty array for non-matching search query', async () => {
            await createTaskFactory(tasksOperations, {
                name: 'Test Task',
                subject: 'Testing',
                priority: 1,
                isChecked: false, 
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });

            const response = await request(app).get('/tasks?search=Nonexistent');

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).toHaveLength(0);
        });

        it('should filter out completed tasks (hideDone)', async () => {
            await createTaskFactory({
                name: 'Done Task',
                subject: 'Testing',
                priority: 1,
                isChecked: true,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });
            await createTaskFactory({
                name: 'Pending Task',
                subject: 'Testing',
                priority: 2,
                isChecked: false,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });

            const response = await request(app).get('/tasks?filter=hideDone');

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].name).toBe('Pending Task');
        });

        it('should show only completed tasks (showDone)', async () => {
            await createTaskFactory({
                name: 'Done Task',
                subject: 'Testing',
                priority: 1,
                isChecked: true,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });
            await createTaskFactory({
                name: 'Pending Task',
                subject: 'Testing',
                priority: 2,
                isChecked: false,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });

            const response = await request(app).get('/tasks?filter=showDone');

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].name).toBe('Done Task');
        });
    });

    describe('PUT', () => {
        it('should update a task', async () => {
            const taskId = await createTaskFactory({
                name: 'Old Task',
                subject: 'Testing',
                priority: 2,
                isChecked: false,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });

            const response = await request(app)
                .put(`/tasks/${taskId}`)
                .send({ name: 'Updated Task', priority: 10 });

            expect(response.status).toBe(StatusCodes.OK);

            const updatedTask = await tasksOperations.findOne({ _id: taskId });
            expect(updatedTask.name).toBe('Updated Task');
            expect(updatedTask.priority).toBe(10);
        });

        it('should return 404 for non-existent task on update', async () => {
            const fakeId = new ObjectId().toString();

            const response = await request(app)
                .put(`/tasks/${fakeId}`)
                .send({ name: 'Updated Task' });

            expect(response.status).toBe(StatusCodes.NOT_FOUND);
        });
    });

    describe('PATCH', () => {
        it('should check a task', async () => {
            const taskId = await createTaskFactory({
                name: 'Old Task',
                subject: 'Testing',
                priority: 2,
                isChecked: false,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });

            const response = await request(app)
                .patch(`/tasks/${taskId}`)
                .send({ name: 'Checked Task', isChecked: true });

            expect(response.status).toBe(StatusCodes.OK);

            const updatedTask = await tasksOperations.findOne({ _id: taskId });
            expect(updatedTask.isChecked).toBe(true);
        });
    });

    describe('DELETE', () => {
        it('should delete a task', async () => {
            const taskId = await createTaskFactory({
                name: 'Task to Delete',
                subject: 'Testing',
                priority: 4,
                isChecked: false,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });

            const response = await request(app).delete(`/tasks/${taskId}`);

            expect(response.status).toBe(StatusCodes.OK);

            const deletedTask = await tasksOperations.findOne({ _id: taskId });
            expect(deletedTask).toBeNull();
        });

        it('should return 404 for non-existent task on delete', async () => {
            const fakeId = new ObjectId().toString();

            const response = await request(app).delete(`/tasks/${fakeId}`);

            expect(response.status).toBe(StatusCodes.NOT_FOUND);
        });

        it('should delete all done tasks', async () => {
            const taskId = await createTaskFactory({
                name: 'Task to Delete',
                subject: 'Testing',
                priority: 4,
                isChecked: true,
                location: {
                    type: 'Point',
                    coordinates: [36.5552, 14.76454]
                },
            });

            const response = await request(app).delete(`/tasks/deleteDone`);

            expect(response.status).toBe(StatusCodes.OK);

            const deletedTask = await tasksOperations.findOne({ _id: taskId });
            expect(deletedTask).toBeNull();
        });
    });
});
