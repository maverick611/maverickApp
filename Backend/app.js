// app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes'); // Ensure the correct path to your routes

const app = express();
app.use(cors());
app.use(express.json()); // This line is important for parsing JSON request bodies
app.use('/', routes); // Ensure routes are mounted at the root

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
