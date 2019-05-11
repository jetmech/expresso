const express = require('express');
const employeesRouter = require('./routes/employees');

const PORT = process.env.PORT || 4000;

const app = express();

app.use('/api/employees/', employeesRouter);

const server = app.listen(PORT);

module.exports = server;