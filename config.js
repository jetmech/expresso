const databasePath = 'database.sqlite';
const testDatabasePath = './test/test.sqlite';

const dbPath = (process.env.NODE_ENV == 'production') ? databasePath : testDatabasePath;

module.exports = {
  dbPath: dbPath
};