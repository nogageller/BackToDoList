const { StatusCodes } = require('http-status-codes');
const { connectDB, getCollectionOperations } = require('../db/connect.js');

const dbMiddleware = (collectionName) => {
    return async (req, res, next) => {
        try {
            const dbName = process.env.NODE_ENV === 'test' ? 'testdb' : 'toDoList';
            // Connect to the database and attach the connection to the request object
            req.db = await connectDB(dbName);

            // Initialize collection operations for the specified collection
            req.collectionOperations = getCollectionOperations(collectionName);

            next();
        } catch (error) {
            console.error('Database connection error:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to connect to database', error });
        }
    };
};

module.exports = dbMiddleware;
