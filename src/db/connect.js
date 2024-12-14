const { MongoClient } = require("mongodb");
require('../../config.js'); 


const uri = process.env.MONGODB_URI;

let client = new MongoClient(uri);

let db = null;

const connectDB = async () => {
    if (!db) {
        try {
            const dbName = process.env.DB_NAME;
            await client.connect();
            db = client.db(dbName);
            console.log(`Connected to database: ${db.databaseName}`);
        } catch (error) {
            console.error('Failed to connect to database', error);
            throw error;
        }
    }
    return db;
}

const closeDB = async () => {
    try {
        await client.close();
        client = null;
        db = null;
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error closing database connection', error);
    }
}

const getCollectionOperations = (collectionName) => {
    return {
        insertOne: async (document) => db.collection(collectionName).insertOne(document),
        deleteOne: async (...args) => db.collection(collectionName).deleteOne(...args),
        find: async (...args) => db.collection(collectionName).find(...args).toArray(),
        findOne: (...args) => db.collection(collectionName).findOne(...args),
        updateOne: async (...args) => db.collection(collectionName).updateOne(...args),
        deleteMany: async (...args) => db.collection(collectionName).deleteMany(...args)
    };
};

module.exports = { connectDB, closeDB, getCollectionOperations };