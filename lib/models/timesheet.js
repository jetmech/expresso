'use strict';

// Weak maps are used to store instance properties.
const _id = new WeakMap();
const _hours = new WeakMap();
const _rate = new WeakMap();
const _date = new WeakMap();
const _employeeId = new WeakMap();

const sqlite3 = require('sqlite3');
const Employee = require('./employee');

const { dbPath } = require('../../config');

// Custom errors
const { ExistenceError, PropertyError } = require('./errors');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err);
  }
});

const Timesheet = class {
  /**
   * Create an instance of timesheet.
   * Can take a JSON object from a resquest body or a row from the database.
   * @param {Object} timesheet - An object representing the timesheet.
   * @param {number} [timesheet.timesheetId] - The timesheet id.
   * @param {number} [timesheet.id] - The timesheet id. Used when constructing from a sqlite3 row object.
   * @param {number} timesheet.hours - The number of hours for the timesheet.
   * @param {number} timesheet.rate - The rate for the timesheet.
   * @param {number} timesheet.date - The timesheet wage.
   * @param {number} [timesheet.employeeId] - The id of the employee for the timesheet. Required if employee_id is undefined.
   * @param {number} [timesheet.employee_id] - The id of the employee for the timesheet. Used when constructing from a sqlite3 row object. Required if employeeId is undefined.
   */
  constructor({ timesheetId, id, hours, rate, date, employeeId, employee_id }) {
    this.timesheetId = timesheetId || id;
    this.hours = hours;
    this.rate = rate;
    this.date = date;
    this.employeeId = employeeId || employee_id;
  }

  /**
   * The timesheet id.
   * @type {number}
   * @throws {PropertyError} - If defined, must be an integer.
   */
  set timesheetId(id) {

    if (typeof id === 'undefined') {
      _id.set(this, undefined);
      return;
    } else if (typeof id === 'string' || typeof id === 'number') {
      id = Number.parseFloat(id);
    } else {
      throw new PropertyError('If defined, timesheetId must be an integer');
    }

    if (id && Number.isInteger(id)) {
      _id.set(this, id);
    } else {
      throw new PropertyError('If defined, timesheetId must be an integer');
    }
  }

  get timesheetId() {
    return _id.get(this);
  }

  /**
   * The timesheet hours.
   * @type {number}
   * @throws {PropertyError} - If defined, must be a number.
   */
  set hours(hours) {

    if (typeof hours === 'string' || typeof hours === 'number') {
      hours = Number.parseFloat(hours);
    } else {
      throw new PropertyError('hours must be an integer');
    }

    if (hours && Number.isInteger(hours)) {
      _hours.set(this, hours);
    } else {
      throw new PropertyError('hours must be an integer');
    }
  }

  get hours() {
    return _hours.get(this);
  }

  /**
   * The timesheet rate.
   * @type {number}
   * @throws {PropertyError} - If defined, must be a number.
   */
  set rate(rate) {

    if (typeof rate === 'string' || typeof rate === 'number') {
      rate = Number.parseFloat(rate);
    } else {
      throw new PropertyError('rate must be a number');
    }

    if (!isNaN(rate)) {
      _rate.set(this, rate);
    } else {
      throw new PropertyError('rate must be a number');
    }

  }

  get rate() {
    return _rate.get(this);
  }

  /**
   * The timesheet date.
   * @type {number}
   * @throws {PropertyError} - If defined, must be an integer.
   */
  set date(date) {

    if (typeof date === 'string' || typeof date === 'number') {
      date = Number.parseFloat(date);
    } else {
      throw new PropertyError('date must be an integer');
    }

    if (date && Number.isInteger(date)) {
      _date.set(this, date);
    } else {
      throw new PropertyError('date must be an integer');
    }
  }

  get date() {
    return _date.get(this);
  }

  /**
   * The id of the employee for the timesheet.
   * @type {number}
   * @throws {PropertyError} - If defined, must be a number.
   */
  set employeeId(employeeId) {

    if (typeof employeeId === 'string' || typeof employeeId === 'number') {
      employeeId = Number.parseFloat(employeeId);
    } else {
      throw new PropertyError('employeeId must be an integer');
    }

    if (employeeId && Number.isInteger(employeeId)) {
      _employeeId.set(this, employeeId);
    } else {
      throw new PropertyError('employeeId must be an integer');
    }
  }

  get employeeId() {
    return _employeeId.get(this);
  }

  /**
   * Get an employee's timesheets from the database.
   * @param {(string|number)} employeeId - The id of the employee.
   * @returns {Promise<Timesheet[]>} Returns a promise for an array of timesheets.
   * @throws {ExistenceError} Rejects with an ExistenceError if the employee is not found.
   */
  static getByEmployeeId(employeeId) {
    const timesheetPromise = () => new Promise((resolve, reject) => {
      db.all(`SELECT *
      FROM Timesheet
      WHERE employee_id = $employeeId;`, {
        $employeeId: employeeId
      },
      (err, row) => {
        if (err) {
          return reject(err);
        } else {
          let result = [];
          row.forEach(timesheet => result.push(new Timesheet(timesheet)));
          return resolve(result);
        }
      });
    });

    return Employee.get(employeeId)
      .then(timesheetPromise);

  }

  /**
   * Get a timesheet from the database.
   * @param {(string|number)} timesheetId - The id of the timesheet to retrieve.
   * @returns {Promise<Timesheet>} Returns a promise for a timesheet.
   * @throws {ExistenceError} Rejects with an ExistenceError if the timesheet is not found.
   */
  static get(timesheetId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Timesheet WHERE id = $timesheetId;', {
        $timesheetId: timesheetId
      }, function (err, row) {
        if (err) {
          return reject(err);
        } else if (row) {
          try {
            let timesheet = new Timesheet(row);
            return resolve(timesheet);
          } catch (err) {
            return reject(err);
          }
        } else {
          return reject(new ExistenceError('Timesheet not found'));
        }
      });
    });
  }

  /**
   * Add this instance of timehsheet to the database.
   * @returns {Promise<Timesheet>} Returns a promise for the instance of employee that has just been added.
   * @throws {ExistenceError} Rejects with an ExistenceError if the employee associated with the timesheet is not found in the database.
   */
  async create() {
    const createPromise = () => new Promise((resolve, reject) => {
      db.run(`INSERT INTO Timesheet (
        hours,
        rate,
        date,
        employee_id)
      VALUES (
        $hours,
        $rate,
        $date,
        $employeeId
      )`, {
        $hours: this.hours,
        $rate: this.rate,
        $date: this.date,
        $employeeId: this.employeeId
      }, function (err) {
        if (err) {
          return reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });

    return Employee.get(this.employeeId)
      .then(createPromise)
      .then(id => Timesheet.get(id));
  }

  /**
   * Update this instance of timesheet in the database.
   * @param {Object} newPropertyValues An object from a request body that contains the updated properties.
   * @param {string} newPropertyValues.name The updated hours.
   * @param {string} newPropertyValues.position The updated rate.
   * @param {namber} newPropertyValues.wage The updated date.
   * @returns {Promise<Timesheet>} Returns a promise for the instance of timesheet that has just been updated.
   * @throws {PropertyError} Rejects with a PropertyError if any of the properties are invalid.
   */
  update(newPropertyValues) {
    const updatePromise = new Promise((resolve, reject) => {

      // This will validate the request body values using existing class logic.
      try {
        this.hours = newPropertyValues.hours;
        this.rate = newPropertyValues.rate;
        this.date = newPropertyValues.date;
      } catch (err) {
        return reject(err);
      }

      db.run(`UPDATE Timesheet
        SET 
          hours = $hours,
          rate = $rate,
          date = $date
        WHERE id = $timesheetId;`, {
        $timesheetId: this.timesheetId,
        $hours: this.hours,
        $rate: this.rate,
        $date: this.date
      }, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });

    return updatePromise.then(() => Timesheet.get(this.timesheetId));
  }

  /**
   * Delete this instance of timesheet from the database.
   */
  delete() {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM
      Timesheet
      WHERE id = $timesheetId;`, {
        $timesheetId: this.timesheetId,
      }, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }

  toJSON() {
    return {
      id: this.timesheetId,
      hours: this.hours,
      rate: this.rate,
      date: this.date,
      employee_id: this.employeeId
    };
  }
};

module.exports = Timesheet;
