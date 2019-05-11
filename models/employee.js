const _id = new WeakMap();
const _name = new WeakMap();
const _position = new WeakMap();
const _wage = new WeakMap();
const _isCurrentEmployee = new WeakMap();

const sqlite3 = require('sqlite3');

const { dbPath } = require('../config');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err);
  }
});

module.exports = class Employee {
  constructor({ employeeId, id, name, position, wage, isCurrentEmployee, is_current_employee }) {
    this.employeeId = employeeId || id;
    this.name = name;
    this.position = position;
    this.wage = wage;
    this.isCurrentEmployee = isCurrentEmployee || is_current_employee || 1;
  }

  set employeeId(id) {

    if (typeof id === 'undefined') {
      _id.set(this, undefined);
      return;
    } else if (typeof id === 'string' || typeof id === 'number') {
      id = Number.parseFloat(id);
    } else {
      throw TypeError('If defined, employeeId must be an integer');
    }

    if (id && Number.isInteger(id)) {
      _id.set(this, id);
    } else {
      throw TypeError('If defined, employeeId must be an integer');
    }
  }

  get employeeId() {
    return _id.get(this);
  }

  set name(name) {
    if (typeof name === 'string') {
      _name.set(this, name);
    } else {
      throw TypeError('Name must be a string');
    }
  }

  get name() {
    return _name.get(this);
  }

  set position(position) {
    if (typeof position === 'string') {
      _position.set(this, position);
    } else {
      throw TypeError('Position must be a string');
    }
  }

  get position() {
    return _position.get(this);
  }

  set wage(wage) {

    if (typeof wage === 'string' || typeof wage === 'number') {
      wage = Number.parseFloat(wage);
    } else {
      throw TypeError('wage must be an integer');
    }

    if (wage && Number.isInteger(wage)) {
      _wage.set(this, wage);
    } else {
      throw TypeError('wage must be an integer');
    }
  }

  get wage() {
    return _wage.get(this);
  }

  set isCurrentEmployee(isCurrentEmployee) {

    if (typeof isCurrentEmployee === 'string' || typeof isCurrentEmployee === 'number') {
      isCurrentEmployee = Number.parseFloat(isCurrentEmployee);
    } else {
      throw TypeError('isCurrentEmployee must be an integer');
    }

    if (isCurrentEmployee && Number.isInteger(isCurrentEmployee)) {
      _isCurrentEmployee.set(this, isCurrentEmployee);
    } else {
      throw TypeError('isCurrentEmployee must be an integer');
    }
  }

  get isCurrentEmployee() {
    return _isCurrentEmployee.get(this);
  }

  static getCurrentlyEmployed() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT *
      FROM Employee
      WHERE is_current_employee = 1;`, (err, row) => {
        if (err) {
          return reject(err);
        } else {
          let result = [];
          row.forEach(employee => result.push(new Employee(employee)));
          return resolve(result);
        }
      });
    });
  }

  toJSON() {
    return {
      id: this.employeeId,
      name: this.name,
      position: this.position,
      wage: this.wage,
      isCurrentEmployee: this.isCurrentEmployee
    };
  }
};
