const express = require('express');
const employeesRouter = require('./lib/routes/employees');
const menusRouter = require('./lib/routes/menus');
const { PropertyError, ExistenceError } = require('./lib/models/errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT || 4000;

const app = express();
if (process.env.NODE_ENV == 'production') {
  app.use(morgan('short'));
}

app.use(cors());
app.use(bodyParser.json());

app.use('/api/employees/', employeesRouter);
app.use('/api/menus/', menusRouter);

// Catch all 404 handler
app.use((req, res, next) => {
  return res.status(404).send();
});

// Catch all error handler
app.use((err, req, res, next) => {

  if (err instanceof PropertyError) {
    return res.status(400).send();
  } else if (err instanceof ExistenceError) {
    if (err.message === 'menu has associated menuItems') {
      return res.status(400).send();
    } else {
      return res.status(404).send();
    }
  } else {
    return res.status(500).send();
  }

});

const server = app.listen(PORT);

module.exports = server;
