'use strict';

// Weak maps are used to store instance properties.
const _id = new WeakMap();
const _name = new WeakMap();
const _position = new WeakMap();
const _wage = new WeakMap();
const _isCurrentEmployee = new WeakMap();

const sqlite3 = require('sqlite3');

const { dbPath } = require('../../config');

// Custom errors
const { ExistenceError, PropertyError } = require('./errors');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err);
  }
});

const Employee = class {

  /**
   * Create an instance of employee.
   * Can take a JSON object from a resquest body or a row from the database.
   * @param {Object} employee - An object representing the employee.
   * @param {number} [employee.employeeId] - The employee id.
   * @param {number} [employee.id] - The employee id. Used when constructing from a sqlite3 row object.
   * @param {string} employee.name - The name of the employee.
   * @param {string} employee.position - The employee position.
   * @param {number} employee.wage - The employee wage.
   * @param {number} [employee.isCurrentEmployee=1] - Set to 1 if the employee is currently employed. Otherwise set to 0.
   * @param {number} [employee.is_current_employee=1] - Set to 1 if the employee is currently employed. Otherwise set to 0. Used when constructing from a sqlite3 row object.
   */
  constructor({ employeeId, id, name, position, wage, isCurrentEmployee, is_current_employee }) {
    this.employeeId = employeeId || id;
    this.name = name;
    this.position = position;
    this.wage = wage;
    this.isCurrentEmployee = isCurrentEmployee || is_current_employee;
  }

  /**
   * The employee id.
   * @type {number}
   * @throws {PropertyError} - If defined, must be an integer.
   */
  set employeeId(id) {

    if (typeof id === 'undefined') {
      _id.set(this, undefined);
      return;
    } else if (typeof id === 'string' || typeof id === 'number') {
      id = Number.parseFloat(id);
    } else {
      throw new PropertyError('If defined, employeeId must be an integer');
    }

    if (id && Number.isInteger(id)) {
      _id.set(this, id);
    } else {
      throw new PropertyError('If defined, employeeId must be an integer');
    }
  }

  get employeeId() {
    return _id.get(this);
  }

  /**
   * The employee name.
   * @type {string}
   * @throws {PropertyError} - Must be a string.
   */
  set name(name) {
    if (typeof name === 'string') {
      _name.set(this, name);
    } else {
      throw new PropertyError('Name must be a string');
    }
  }

  get name() {
    return _name.get(this);
  }

  /**
   * The employee position.
   * @type {string}
   * @throws {PropertyError} - Must be a string.
   */
  set position(position) {
    if (typeof position === 'string') {
      _position.set(this, position);
    } else {
      throw new PropertyError('Position must be a string');
    }
  }

  get position() {
    return _position.get(this);
  }

  /**
   * The employee wage.
   * @type {number}
   * @throws {PropertyError} - Must be a number.
   */
  set wage(wage) {

    if (typeof wage === 'string' || typeof wage === 'number') {
      wage = Number.parseFloat(wage);
    } else {
      throw new PropertyError('wage must be an integer');
    }

    if (wage && Number.isInteger(wage)) {
      _wage.set(this, wage);
    } else {
      throw new PropertyError('wage must be an integer');
    }
  }

  get wage() {
    return _wage.get(this);
  }

  /**
   * Set to 1 if the employee is currently employed. Otherwise set to 0.
   * @type {number}
   * @throws {PropertyError} - Must be either 1 or 0.
   */
  set isCurrentEmployee(isCurrentEmployee) {

    switch (isCurrentEmployee) {
      case 0:

        _isCurrentEmployee.set(this, isCurrentEmployee);
        break;

      case 1:

        _isCurrentEmployee.set(this, isCurrentEmployee);
        break;

      case undefined:

        _isCurrentEmployee.set(this, 1);
        break;

      default:

        throw new PropertyError('isCurrentEmployee must be either 1 or 0');
    }
  }

  get isCurrentEmployee() {
    return _isCurrentEmployee.get(this);
  }

  /**
   * Get all employees from the database where is_current_employee equals 1.
   * @returns {Promise<Employee[]>} Returns a promise for an array employees.
   */
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

  /**
   * Get an employee from the database.
   * @param {(string|number)} employeeId - The id of the employee to retrieve.
   * @returns {Promise<Employee>} Returns a promise for an employee.
   * @throws {ExistenceError} Rejects with an ExistenceError if the employee is not found.
   */
  static get(employeeId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Employee WHERE id = $employeeId;', {
        $employeeId: employeeId
      }, function (err, row) {
        if (err) {
          return reject(err);
        } else if (row) {
          try {
            let employee = new Employee(row);
            return resolve(employee);
          } catch (err) {
            return reject(err);
          }
        } else {
          return reject(new ExistenceError('Employee not found'));
        }
      });
    });
  }

  /**
   * Add this instance of employee to the database.
   * @returns {Promise<Employee>} Returns a promise for the instance of employee that has just been added.
   */
  create() {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO Employee (
        name,
        position,
        wage)
      VALUES (
        $name,
        $position,
        $wage
      )`, {
        $name: this.name,
        $position: this.position,
        $wage: this.wage
      }, function (err) {
        if (err) {
          return reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    }).then(id => Employee.get(id));
  }

  /**
   * Update this instance of employee in the database.
   * @param {Object} newPropertyValues An object from a request body that contains the updated properties.
   * @param {Object} newPropertyValues.name The updated name.
   * @param {Object} newPropertyValues.position The updated position.
   * @param {Object} newPropertyValues.wage The updated wage.
   * @returns {Promise<Employee>} Returns a promise for the instance of employee that has just been updated.
   * @throws {PropertyError} Rejects with a PropertyError if any of the properties are invalid.
   */
  update(newPropertyValues) {
    const updatePromise = new Promise((resolve, reject) => {

      // This will validate the request body values using existing class logic.
      try {
        this.name = newPropertyValues.name;
        this.position = newPropertyValues.position;
        this.wage = newPropertyValues.wage;
      } catch (err) {
        return reject(err);
      }

      db.run(`UPDATE Employee
        SET 
          name = $name,
          position = $position,
          wage = $wage,
          is_current_employee = $isCurrentEmployee
        WHERE id = $employeeId;`, {
        $employeeId: this.employeeId,
        $name: this.name,
        $position: this.position,
        $wage: this.wage,
        $isCurrentEmployee: this.isCurrentEmployee
      }, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });

    return updatePromise
      .then(() => Employee.get(this.employeeId));
  }

  /**
   * Sets is_current_employee to 0 for this instance of employee.
   * @returns {Promise<Employee>} Returns a promise for the instance of employee that has just been deleted.
   */
  delete() {
    let deletePromise = new Promise((resolve, reject) => {
      db.run(`UPDATE Employee
      SET 
        is_current_employee = 0
      WHERE id = $employeeId;`, {
        $employeeId: this.employeeId,
      }, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });

    return deletePromise
      .then(() => Employee.get(this.employeeId));
  }

  // Required because classes with getters and setters do not have own properties.
  toJSON() {
    return {
      id: this.employeeId,
      name: this.name,
      position: this.position,
      wage: this.wage,
      is_current_employee: this.isCurrentEmployee
    };
  }
};

module.exports = Employee;
