const express = require('express');
const employeesRouter = require('./routes/employees');
const menusRouter = require('./routes/menus');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json());

app.use('/api/employees/', employeesRouter);
app.use('/api/menus/', menusRouter);

const server = app.listen(PORT);

module.exports = server;