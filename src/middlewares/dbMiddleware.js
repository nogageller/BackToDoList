const { connectDB, getCollectionOperations } = require('../db/connect.js');
const HttpStatus = require('../enums/responseSatus.js');


const dbMiddleware = (collectionName) => {
    return async (req, res, next) => {
        try {
            // Connect to the database and attach the connection to the request object
            req.db = await connectDB();

            // Initialize collection operations for the specified collection
            req.collectionOperations = getCollectionOperations(collectionName);

            next();
        } catch (error) {
            console.error('Database connection error:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to connect to database', error });
        }
    };
};

module.exports = dbMiddleware;
