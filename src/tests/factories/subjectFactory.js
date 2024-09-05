const _ = require('lodash');
const { getCollectionOperations } = require('../../db/connect');

const subjectsOperations = getCollectionOperations('testSubjects');

const subjectFactory = async (subjectData = {}) => {
    const defaultSubject = {
        name: 'Default Subject'
    };

    const subject = _.merge({}, defaultSubject, subjectData);
    const result = await subjectsOperations.insertOne(subject);

    return result.insertedId;
};

module.exports = subjectFactory;