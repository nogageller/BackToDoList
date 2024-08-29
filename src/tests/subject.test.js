const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');
const { StatusCodes } = require('http-status-codes');
const subjectRouter = require('../routes/subjects.js');
const createSubjectFactory = require('./factories/subjectFactory.js');
const { connectDB, closeDB, getCollectionOperations } = require('../db/connect.js');

process.env.NODE_ENV = 'test';

const app = express();
app.use(express.json());
app.use('/subjects', subjectRouter);

const testOperations = getCollectionOperations('testSubjects');

beforeAll(async () => {
    await connectDB()
});

afterAll(async () => {
    await closeDB()
});

beforeEach(async () => {
    console.log('Clearing collection');
    await testOperations.deleteMany({});
    const subjects = await testOperations.find({});
    console.log('subjects in DB after cleanup:', subjects);
});

describe('Subject Routes', () => {
    it('should create a subject', async () => {
        const subject = {
            name: 'Test subject'
        };

        const response = await request(app).post('/subjects').send(subject);

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).toHaveProperty('insertedId');
    });

    it('should get all subjects', async () => {
        await createSubjectFactory(testOperations, {
            name: 'Test subject'
        });

        const response = await request(app).get('/subjects');

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveLength(1);
    });

    it('should update a subject', async () => {
        const subjectId = await createSubjectFactory(testOperations, {
            name: 'Old subject'
        });

        const response = await request(app)
            .put(`/subjects/${subjectId}`)
            .send({ name: 'Updated subject' });

        expect(response.status).toBe(StatusCodes.OK);

        const updatedsubject = await testOperations.findOne({ _id: subjectId });
        expect(updatedsubject.name).toBe('Updated subject');
    });

    it('should delete a subject', async () => {
        const subjectId = await createSubjectFactory(testOperations, {
            name: 'subject to Delete'
        });

        const response = await request(app).delete(`/subjects/${subjectId}`);

        expect(response.status).toBe(StatusCodes.OK);

        const deletedsubject = await testOperations.findOne({ _id: subjectId });
        expect(deletedsubject).toBeNull();
    });

    it('should return 404 for non-existent subject on update', async () => {
        const fakeId = new ObjectId().toString(); 

        const response = await request(app)
            .put(`/subjects/${fakeId}`)
            .send({ name: 'Updated subject' });

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 404 for non-existent subject on delete', async () => {
        const fakeId = new ObjectId().toString(); 

        const response = await request(app).delete(`/subjects/${fakeId}`);

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 400 for another subject parameter which is not allowed', async () => {
        const subject = {
            name: 'Test Subject',
            date: 10,
        };

        const response = await request(app).post('/subjects').send(subject);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
});

