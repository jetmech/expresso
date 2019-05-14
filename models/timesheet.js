const _id = new WeakMap();
const _hours = new WeakMap();
const _rate = new WeakMap();
const _date = new WeakMap();
const _employeeId = new WeakMap();

const sqlite3 = require('sqlite3');
const Employee = require('./employee');

const { dbPath } = require('../config');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err);
  }
});

module.exports = class Timesheet {
  constructor({ timesheetId, id, hours, rate, date, employeeId, employee_id }) {
    this.timesheetId = timesheetId || id;
    this.hours = hours;
    this.rate = rate;
    this.date = date;
    this.employeeId = employeeId || employee_id;
  }

  set timesheetId(id) {

    if (typeof id === 'undefined') {
      _id.set(this, undefined);
      return;
    } else if (typeof id === 'string' || typeof id === 'number') {
      id = Number.parseFloat(id);
    } else {
      throw TypeError('If defined, timesheetId must be an integer');
    }

    if (id && Number.isInteger(id)) {
      _id.set(this, id);
    } else {
      throw TypeError('If defined, timesheetId must be an integer');
    }
  }

  get timesheetId() {
    return _id.get(this);
  }

  set hours(hours) {

    if (typeof hours === 'string' || typeof hours === 'number') {
      hours = Number.parseFloat(hours);
    } else {
      throw TypeError('hours must be an integer');
    }

    if (hours && Number.isInteger(hours)) {
      _hours.set(this, hours);
    } else {
      throw TypeError('hours must be an integer');
    }
  }

  get hours() {
    return _hours.get(this);
  }

  set rate(rate) {

    if (typeof rate === 'string' || typeof rate === 'number') {
      rate = Number.parseFloat(rate);
    } else {
      throw TypeError('rate must be a number');
    }

    if (!isNaN(rate)) {
      _rate.set(this, rate);
    } else {
      throw TypeError('rate must be a number');
    }

  }

  get rate() {
    return _rate.get(this);
  }

  set date(date) {

    if (typeof date === 'string' || typeof date === 'number') {
      date = Number.parseFloat(date);
    } else {
      throw TypeError('date must be an integer');
    }

    if (date && Number.isInteger(date)) {
      _date.set(this, date);
    } else {
      throw TypeError('date must be an integer');
    }
  }

  get date() {
    return _date.get(this);
  }

  set employeeId(employeeId) {

    if (typeof employeeId === 'string' || typeof employeeId === 'number') {
      employeeId = Number.parseFloat(employeeId);
    } else {
      throw TypeError('employeeId must be an integer');
    }

    if (employeeId && Number.isInteger(employeeId)) {
      _employeeId.set(this, employeeId);
    } else {
      throw TypeError('employeeId must be an integer');
    }
  }

  get employeeId() {
    return _employeeId.get(this);
  }

  static async getByEmployeeId(employeeId) {
    let timesheetPromise = new Promise((resolve, reject) => {
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

    try {
      let employee = await Employee.get(employeeId);
      if (employee) {
        return timesheetPromise;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

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
          return reject(new RangeError('Timesheet not found'));
        }
      });
    });
  }

  async create() {
    const createPromise = new Promise((resolve, reject) => {
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
    }).then((id) => Timesheet.get(id), (err) => Promise.reject(err));

    try {
      let employee = await Employee.get(this.employeeId);
      if (employee) {
        return createPromise;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

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
          return resolve(this.timesheetId);
        }
      });
    });

    return updatePromise.then((id) => Timesheet.get(id), (err) => Promise.reject(err));
  }

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
          return resolve(true);
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
