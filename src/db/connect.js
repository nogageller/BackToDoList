const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

let db = null;

const connectDB = async () => {
    if (!db) {
        try {
            await client.connect();
            db = client.db('toDoList'); 
            console.log('Connected to database');
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
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error closing database connection', error);
    }
}

const getCollectionOperations = (collectionName) => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }

    const collection = db.collection(collectionName);

    return {
        insertOne: async (document) => collection.insertOne(document),
        deleteOne: async (...args) => collection.deleteOne(...args),
        find: async (...args) => collection.find(...args).toArray(),
        updateOne: async (...args) => collection.updateOne(...args)
    };
};

module.exports = { connectDB, closeDB, getCollectionOperations };