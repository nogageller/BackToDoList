const { ObjectId } = require('mongodb');

const createSubjectFactory = async (db, subjectData = {}) => {
    const defaultSubject = {
        name: 'Default Subject'
    };

    const subject = { ...defaultSubject, ...subjectData };
    const result = await db.collection('testSubjects').insertOne(subject);

    // After inserting subject
    const subjects = await db.collection('testSubjects').find({}).toArray();
    console.log('Subjects in DB:', subjects);

    return result.insertedId;
};

module.exports = createSubjectFactory;