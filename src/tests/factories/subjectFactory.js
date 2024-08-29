
const createSubjectFactory = async (testOperations, subjectData = {}) => {
    const defaultSubject = {
        name: 'Default Subject'
    };

    const subject = { ...defaultSubject, ...subjectData };
    const result = await testOperations.insertOne(subject);

    const subjects = await testOperations.find({});
    console.log('Subjects in DB:', subjects);

    return result.insertedId;
};

module.exports = createSubjectFactory;