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
          return reject(new RangeError('Employee not found'));
        }
      });
    });
  }

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
    }).then((id) => Employee.get(id), (err) => Promise.reject(err));
  }

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
          return resolve(this.employeeId);
        }
      });
    });

    return updatePromise.then((id) => Employee.get(id), (err) => Promise.reject(err));
  }

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
