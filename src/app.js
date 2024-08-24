const express = require("express")
const router = require("./routes/index.js")

const app = express();

app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

