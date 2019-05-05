const path = require('path');

const databaseFileName = 'database.sqlite';
const dbPath = process.env.TEST_DATABASE || path.join(__dirname, databaseFileName);

module.exports = {
  dbPath: dbPath
};