const express = require('express');

const PORT = process.env.PORT || 4000;

const app = express();

const server = app.listen(PORT);

module.exports = server;