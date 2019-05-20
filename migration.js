/* eslint-disable no-console */
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
    console.log(`Database creation failed with error: ${err}`);
  } else {
    console.log('Database created');
  }
});

db.serialize(function() {

  db.exec(`CREATE TABLE IF NOT EXISTS "Employee" (
    "id"	INTEGER,
    "name"	TEXT NOT NULL,
    "position"	TEXT NOT NULL,
    "wage"	TEXT NOT NULL,
    "is_current_employee"	INTEGER DEFAULT 1,
    PRIMARY KEY("id")
  );`);
  
  db.exec(`CREATE TABLE IF NOT EXISTS "Timesheet" (
    "id" INTEGER,
    "hours" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "date" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    FOREIGN KEY("employee_id") REFERENCES "Employee"("id"),
    PRIMARY KEY("id")
  );`);
  
  db.exec(`CREATE TABLE IF NOT EXISTS "Menu" (
    "id" INTEGER,
    "title" INTEGER NOT NULL,
    PRIMARY KEY("id")
  );`);
  
  db.exec(`CREATE TABLE IF NOT EXISTS "MenuItem" (
    "id" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "inventory" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    FOREIGN KEY("menu_id") REFERENCES "Menu"("id"),
    PRIMARY KEY("id")
  );`);
});
