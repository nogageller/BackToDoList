const _ = require('lodash');

const subjectFactory = async (testOperations, subjectData = {}) => {
    const defaultSubject = {
        name: 'Default Subject'
    };

    const subject = _.merge({}, defaultSubject, subjectData);
    const result = await testOperations.insertOne(subject);

    return result.insertedId;
};

module.exports = subjectFactory;