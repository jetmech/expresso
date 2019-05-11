'use strict';

const { assert } = require('chai');

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

// const testDb = new sqlite3.Database(process.env.TEST_DATABASE);

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
  });

});

function createEmployee() {
  return new Employee(employeeTemplate);
}
