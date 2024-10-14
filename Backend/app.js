const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const routes = require('./routes/routes');

const app = express();
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});