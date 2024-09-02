const express = require("express")
const cors = require('cors');
const router = require("./routes");
const { connectDB } = require("./db/connect.js");

const init = async () => {
    try {
        await connectDB()
        const app = express();

        const PORT = process.env.PORT || 3000;


        const server = app.listen(PORT, () => {
            console.log(`Running on port ${PORT}`);
        });

        app.use(cors({
            origin: 'http://localhost:5173', // Your frontend URL
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allow these HTTP methods
            allowedHeaders: ['Content-Type'], // Allow these headers
        }));
        app.use(express.json());
        app.use(router);

        return { app, server }
    } catch (err) {
        console.error("Error initializing the server:", err)
        process.exit(1)
    }

}

module.exports = {
    init,
}

