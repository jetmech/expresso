const express = require('express');
const employeesRouter = require('./routes/employees');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json());

app.use('/api/employees/', employeesRouter);

const server = app.listen(PORT);

module.exports = server;