'use strict';

const { assert } = require('chai');
const sqlite3 = require('sqlite3');
const { dbPath } = require('../../config');

const Employee = require('../../models/employee');
let employee = {};
let employees = [];

const seed = require('./../seed');

const employeeTemplate = {
  employeeId: 1,
  name: 'New Employee',
  position: 'Position',
  wage: 30,
  isCurrentEmployee: 0
};

const testDb = new sqlite3.Database(dbPath);

describe('Employee', function () {

  describe('.constructor', function () {

    beforeEach('Creater an instance of Employee', function () {
      employee = createEmployee();
    });

    it('returns an Employee object', function () {
      assert.instanceOf(employee, Employee);
    });
  });

  describe('#employeeId', function () {

    beforeEach('Create an instance of Employee', function () {
      employee = createEmployee();
    });

    it('is a number', function () {
      assert.isNumber(employee.employeeId);
    });

    it('can be undefined', function () {
      function shouldNotThrow() {
        employee.employeeId = undefined;
      }
      assert.doesNotThrow(shouldNotThrow);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        employee.employeeId = nonNumber;
      }
      assert.throws(shouldThrow);
    });

    it('throws an error if set to a non-integer', function () {
      let nonInteger = 42.42;
      function shouldThrow() {
        employee.employeeId = nonInteger;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('#name', function () {

    beforeEach('Create an instance of Employee', function () {
      employee = createEmployee();
    });

    it('is a string', function () {
      assert.isString(employee.name);
    });

    it('throws an error if set to a non-string value', function () {
      let nonString = 42;
      function shouldThrow() {
        employee.name = nonString;
      }
      assert.throws(shouldThrow);
    });
  });

  describe('#position', function () {

    beforeEach('Create an instance of Employee', function () {
      employee = createEmployee();
    });

    it('is a string', function () {
      assert.isString(employee.position);
    });

    it('throws an error if set to a non-string value', function () {
      let nonString = 42;
      function shouldThrow() {
        employee.position = nonString;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('#wage', function () {

    beforeEach('Create an instance of Employee', function () {
      employee = createEmployee();
    });

    it('is a number', function () {
      assert.isNumber(employee.wage);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        employee.wage = nonNumber;
      }
      assert.throws(shouldThrow);
    });

    it('throws an error if set to a non-integer', function () {
      let nonInteger = 42.42;
      function shouldThrow() {
        employee.wage = nonInteger;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('#isCurrentEmployee', function () {

    beforeEach('Create an instance of Employee', function () {
      employee = createEmployee();
    });

    it('is a number', function () {
      assert.isNumber(employee.isCurrentEmployee);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        employee.isCurrentEmployee = nonNumber;
      }
      assert.throws(shouldThrow);
    });

    it('throws an error if set to a non-integer', function () {
      let nonInteger = 42.42;
      function shouldThrow() {
        employee.isCurrentEmployee = nonInteger;
      }
      assert.throws(shouldThrow);
    });

    it('can be zero', function () {
      function shouldNotThrow() {
        employee.isCurrentEmployee = 0;
      }
      assert.doesNotThrow(shouldNotThrow);
    });

    it('defaults to a vlaue of 1', function () {
      let modifiedEmployee = Object.assign({}, employeeTemplate);
      delete modifiedEmployee.isCurrentEmployee;
      let employee = new Employee(modifiedEmployee);
      assert.propertyVal(employee, 'isCurrentEmployee', 1);
    });

  });

  describe('.getCurrentlyEmployed()', function () {

    beforeEach('populute the employee table', function (done) {
      seed.seedEmployeeDatabase(done);
    });

    beforeEach('get the employees', async function () {
      employees = await Employee.getCurrentlyEmployed();
    });

    it('retrurns an array', async function () {
      assert.isArray(employees);
    });

    it('each element is an Employee object', async function () {
      employees.forEach(employee => assert.instanceOf(employee, Employee));
    });

  });

  describe('.get()', function () {

    beforeEach('populute the employee table', function (done) {
      seed.seedEmployeeDatabase(done);
    });

    beforeEach('get the employee', async function () {
      employee = await Employee.get(1);
    });

    it('returns an Employee object', function () {
      assert.instanceOf(employee, Employee);
    });

    it('the returned object has the correct property values', function () {
      assert.deepPropertyVal(employee, 'employeeId', 1);
      assert.deepPropertyVal(employee, 'name', 'Employee 1');
      assert.deepPropertyVal(employee, 'position', 'Manager');
      assert.deepPropertyVal(employee, 'wage', 10);
      assert.deepPropertyVal(employee, 'isCurrentEmployee', 1);
    });

  });

  describe('#create()', function () {

    let newEmployee;

    beforeEach('populute the employee table', function (done) {
      seed.seedEmployeeDatabase(done);
    });

    beforeEach('Create an instance of Employee', function () {
      employee = createEmployee();
    });

    beforeEach('Add the employee to the database', async function () {
      newEmployee = await employee.create();
    });

    it('adds the employee to the database', function (done) {

      testDb.get(`SELECT *
      FROM Employee
      WHERE id = $employeeId;`, {
        $employeeId: newEmployee.employeeId
      }, function (err, row) {
        if (err) {
          done(err);
        } else if (row) {
          assert.equal(newEmployee.employeeId, row.id);
          done();
        } else {
          assert.fail();
        }
      });
    });

    it('returns an employee object after a successful creation', function () {
      assert.instanceOf(newEmployee, Employee);
    });

    it('the returned object has the correct property values', function () {
      assert.deepPropertyVal(newEmployee, 'employeeId', 4);
      assert.deepPropertyVal(newEmployee, 'name', 'New Employee');
      assert.deepPropertyVal(newEmployee, 'position', 'Position');
      assert.deepPropertyVal(newEmployee, 'wage', 30);
      assert.deepPropertyVal(newEmployee, 'isCurrentEmployee', 1);
    });

  });

  describe('#update()', function () {

    let updatedEmployee;
    let updatedProperties = {
      name: 'Updated Employee',
      position: 'Updated Position',
      wage: 35
    };

    beforeEach('populute the employee table', function (done) {
      seed.seedEmployeeDatabase(done);
    });

    beforeEach('Get an Employee from the database', async function () {
      employee = await Employee.get(1);
    });

    beforeEach('Update the employee', async function () {
      updatedEmployee = await employee.update(updatedProperties);
    });

    it('updates the employee in the database', function (done) {

      testDb.get(`SELECT *
      FROM Employee
      WHERE id = $employeeId;`, {
        $employeeId: updatedEmployee.employeeId
      }, function (err, row) {
        if (err) {
          done(err);
        } else if (row) {
          assert.strictEqual(row.id, 1);
          assert.strictEqual(row.name, 'Updated Employee');
          assert.strictEqual(row.position, 'Updated Position');
          assert.strictEqual(row.wage, 35);
          assert.strictEqual(row.is_current_employee, 1);
          done();
        } else {
          assert.fail();
        }
      });
    });

    it('returns an employee object after a successful update', function () {
      assert.instanceOf(updatedEmployee, Employee);
    });

    it('the returned object has the correct property values', function () {
      assert.deepPropertyVal(updatedEmployee, 'employeeId', 1);
      assert.deepPropertyVal(updatedEmployee, 'name', 'Updated Employee');
      assert.deepPropertyVal(updatedEmployee, 'position', 'Updated Position');
      assert.deepPropertyVal(updatedEmployee, 'wage', 35);
      assert.deepPropertyVal(updatedEmployee, 'isCurrentEmployee', 1);
    });

  });

  describe('#delete()', function () {

    let deletedEmployee;

    beforeEach('populute the employee table', function (done) {
      seed.seedEmployeeDatabase(done);
    });

    beforeEach('Get an Employee from the database', async function () {
      employee = await Employee.get(1);
    });

    beforeEach('Delete the employee', async function () {
      deletedEmployee = await employee.delete();
    });

    it('sets the value of "is_current_employee" to 0', function (done) {

      testDb.get(`SELECT *
      FROM Employee
      WHERE id = $employeeId;`, {
        $employeeId: deletedEmployee.employeeId
      }, function (err, row) {
        if (err) {
          done(err);
        } else if (row) {
          assert.strictEqual(row.id, 1);
          assert.strictEqual(row.name, 'Employee 1');
          assert.strictEqual(row.position, 'Manager');
          assert.strictEqual(row.wage, 10);
          assert.strictEqual(row.is_current_employee, 0);
          done();
        } else {
          assert.fail();
        }
      });
    });

    it('returns an employee object after a successful update', function () {
      assert.instanceOf(deletedEmployee, Employee);
    });

    it('the returned object has the correct property values', function () {
      assert.deepPropertyVal(deletedEmployee, 'employeeId', 1);
      assert.deepPropertyVal(deletedEmployee, 'name', 'Employee 1');
      assert.deepPropertyVal(deletedEmployee, 'position', 'Manager');
      assert.deepPropertyVal(deletedEmployee, 'wage', 10);
      assert.deepPropertyVal(deletedEmployee, 'isCurrentEmployee', 0);
    });

  });

});

function createEmployee() {
  return new Employee(employeeTemplate);
}
