const request = require('supertest');
const express = require('express');
const { ObjectId, MongoClient } = require('mongodb');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config({ path: '.env.test' });
const subjectRouter = require('../routes/subjects.js');
const createSubjectFactory = require('./factories/subjectFactory.js');

process.env.NODE_ENV = 'test';

const app = express();
app.use(express.json());
app.use('/subjects', subjectRouter);

const mongoUrl = 'mongodb://localhost:27017';
let db;
let client;

beforeAll(async () => {
    client = await MongoClient.connect(mongoUrl);
    db = client.db('testdb'); // Use a separate test database
    console.log(`Connected to database: ${db.databaseName}`); // Debugging line
});

afterAll(async () => {
    await client.close();
});

beforeEach(async () => {
    console.log('Clearing collection');
    await db.collection('testSubjects').deleteMany({});
    // After deleting subjects
    const subjects = await db.collection('testSubjects').find({}).toArray();
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
        await createSubjectFactory(db, {
            name: 'Test subject'
        });

        const response = await request(app).get('/subjects');

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveLength(1);
    });

    it('should update a subject', async () => {
        const subjectId = await createSubjectFactory(db, {
            name: 'Old subject'
        });

        const response = await request(app)
            .put(`/subjects/${subjectId}`)
            .send({ name: 'Updated subject' });

        expect(response.status).toBe(StatusCodes.OK);

        const updatedsubject = await db.collection('testSubjects').findOne({ _id: subjectId });
        expect(updatedsubject.name).toBe('Updated subject');
    });

    it('should delete a subject', async () => {
        const subjectId = await createSubjectFactory(db, {
            name: 'subject to Delete'
        });

        const response = await request(app).delete(`/subjects/${subjectId}`);

        expect(response.status).toBe(StatusCodes.OK);

        const deletedsubject = await db.collection('testSubjects').findOne({ _id: subjectId });
        expect(deletedsubject).toBeNull();
    });

    it('should return 404 for non-existent subject on update', async () => {
        const fakeId = new ObjectId().toString(); // Generate a fake ObjectId

        const response = await request(app)
            .put(`/subjects/${fakeId}`)
            .send({ name: 'Updated subject' });

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 404 for non-existent subject on delete', async () => {
        const fakeId = new ObjectId().toString(); // Generate a fake ObjectId

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

