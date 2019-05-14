'use strict';

const { assert } = require('chai');
const sqlite3 = require('sqlite3');

const Timesheet = require('../../models/timesheet');
let timesheet = {};
let timesheets = [];

const seed = require('./../seed');

const timesheetTemplate = {
  timesheetId: 1,
  hours: 10,
  rate: 15.5,
  date: 1506100907820,
  employeeId: 1,
};

const testDb = new sqlite3.Database(process.env.TEST_DATABASE);

describe('Timesheet', function () {

  describe('.constructor', function () {

    beforeEach('Creater an instance of Timesheet', function () {
      timesheet = createTimesheet();
    });

    it('returns a Timesheet object', function () {
      assert.instanceOf(timesheet, Timesheet);
    });
  });

  describe('#timesheetId', function () {

    beforeEach('Create an instance of Timesheet', function () {
      timesheet = createTimesheet();
    });

    it('is a number', function () {
      assert.isNumber(timesheet.timesheetId);
    });

    it('can be undefined', function () {
      function shouldNotThrow() {
        timesheet.timesheetId = undefined;
      }
      assert.doesNotThrow(shouldNotThrow);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        timesheet.timesheetId = nonNumber;
      }
      assert.throws(shouldThrow);
    });

    it('throws an error if set to a non-integer', function () {
      let nonInteger = 42.42;
      function shouldThrow() {
        timesheet.timesheetId = nonInteger;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('#hours', function () {

    beforeEach('Create an instance of Timesheet', function () {
      timesheet = createTimesheet();
    });

    it('is a number', function () {
      assert.isNumber(timesheet.hours);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        timesheet.hours = nonNumber;
      }
      assert.throws(shouldThrow);
    });

    it('throws an error if set to a non-integer', function () {
      let nonInteger = 42.42;
      function shouldThrow() {
        timesheet.hours = nonInteger;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('#date', function () {

    beforeEach('Create an instance of Timesheet', function () {
      timesheet = createTimesheet();
    });

    it('is a number', function () {
      assert.isNumber(timesheet.date);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        timesheet.date = nonNumber;
      }
      assert.throws(shouldThrow);
    });

    it('throws an error if set to a non-integer', function () {
      let nonInteger = 42.42;
      function shouldThrow() {
        timesheet.date = nonInteger;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('#rate', function () {

    beforeEach('Create an instance of Timesheet', function () {
      timesheet = createTimesheet();
    });

    it('is a number', function () {
      assert.isNumber(timesheet.rate);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        timesheet.rate = nonNumber;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('#employeeId', function () {

    beforeEach('Create an instance of Timesheet', function () {
      timesheet = createTimesheet();
    });

    it('is a number', function () {
      assert.isNumber(timesheet.employeeId);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        timesheet.employeeId = nonNumber;
      }
      assert.throws(shouldThrow);
    });

    it('throws an error if set to a non-integer', function () {
      let nonInteger = 42.42;
      function shouldThrow() {
        timesheet.employeeId = nonInteger;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('.getByEmployeeId()', function () {

    beforeEach('populute the employee table', function (done) {
      seed.seedEmployeeDatabase(done);
    });

    beforeEach('populute the timesheet table', function (done) {
      seed.seedTimesheetDatabase(done);
    });

    beforeEach('get the timesheets', async function () {
      timesheets = await Timesheet.getByEmployeeId(1);
    });

    it('retrurns an array', async function () {
      assert.isArray(timesheets);
    });

    it('each element is a Timesheet object', async function () {
      timesheets.forEach(timesheet => assert.instanceOf(timesheet, Timesheet));
    });

    it('returns the correct numbe of timesheets', function () {
      assert.lengthOf(timesheets, 2);
    });

  });

  describe('.get()', function () {

    beforeEach('populute the employee table', function (done) {
      seed.seedEmployeeDatabase(done);
    });

    beforeEach('populute the timesheet table', function (done) {
      seed.seedTimesheetDatabase(done);
    });

    beforeEach('get the timesheet', async function () {
      timesheet = await Timesheet.get(1);
    });

    it('returns a Timesheet object', function () {
      assert.instanceOf(timesheet, Timesheet);
    });

    it('the returned object has the correct property values', function () {
      assert.deepPropertyVal(timesheet, 'timesheetId', 1);
      assert.deepPropertyVal(timesheet, 'hours', 10);
      assert.deepPropertyVal(timesheet, 'rate', 15.5);
      assert.deepPropertyVal(timesheet, 'date', 1506100907820);
      assert.deepPropertyVal(timesheet, 'employeeId', 1);
    });

  });

  describe('#create()', function () {

    let newTimesheet;

    beforeEach('populute the employee table', function (done) {
      seed.seedEmployeeDatabase(done);
    });

    beforeEach('populute the timesheet table', function (done) {
      seed.seedTimesheetDatabase(done);
    });

    beforeEach('create an instance of Timesheet', function () {
      timesheet = createTimesheet();
    });

    beforeEach('Add the timesheet to the database', async function () {
      newTimesheet = await timesheet.create();
    });

    it('adds the timesheet to the database', function (done) {

      testDb.get(`SELECT *
      FROM Timesheet
      WHERE id = $timesheetId;`, {
        $timesheetId: newTimesheet.timesheetId
      }, function (err, row) {
        if (err) {
          done(err);
        } else if (row) {
          assert.equal(newTimesheet.timesheetId, row.id);
          done();
        } else {
          assert.fail();
        }
      });
    });

    it('returns a timesheet object after a successful creation', function () {
      assert.instanceOf(newTimesheet, Timesheet);
    });

    it('the returned object has the correct property values', function () {
      assert.deepPropertyVal(newTimesheet, 'timesheetId', 4);
      assert.deepPropertyVal(newTimesheet, 'hours', 10);
      assert.deepPropertyVal(newTimesheet, 'rate', 15.5);
      assert.deepPropertyVal(newTimesheet, 'date', 1506100907820);
      assert.deepPropertyVal(newTimesheet, 'employeeId', 1);
    });

  });

  describe('#update()', function () {

    let updatedTimesheet;
    let updatedProperties = {
      hours: 20,
      rate: 3.5,
      date: 100
    };

    beforeEach('populute the employee table', function (done) {
      seed.seedEmployeeDatabase(done);
    });

    beforeEach('populute the timesheet table', function (done) {
      seed.seedTimesheetDatabase(done);
    });

    beforeEach('Get a timesheet from the database', async function () {
      timesheet = await Timesheet.get(1);
    });

    beforeEach('Update the timesheet', async function () {
      updatedTimesheet = await timesheet.update(updatedProperties);
    });

    it('updates the timesheet in the database', function (done) {

      testDb.get(`SELECT *
      FROM Timesheet
      WHERE id = $timesheetId;`, {
        $timesheetId: updatedTimesheet.timesheetId
      }, function (err, row) {
        if (err) {
          done(err);
        } else if (row) {
          assert.strictEqual(row.id, 1);
          assert.strictEqual(row.hours, 20);
          assert.strictEqual(row.rate, 3.5);
          assert.strictEqual(row.date, 100);
          done();
        } else {
          assert.fail();
        }
      });
    });

    it('returns a timesheet object after a successful update', function () {
      assert.instanceOf(updatedTimesheet, Timesheet);
    });

    it('the returned object has the correct property values', function () {
      assert.deepPropertyVal(updatedTimesheet, 'timesheetId', 1);
      assert.deepPropertyVal(updatedTimesheet, 'hours', 20);
      assert.deepPropertyVal(updatedTimesheet, 'rate', 3.5);
      assert.deepPropertyVal(updatedTimesheet, 'date', 100);
      assert.deepPropertyVal(updatedTimesheet, 'employeeId', 1);
    });

  });

  describe('#delete()', function () {

    let deleteResult;

    beforeEach('populute the employee table', function (done) {
      seed.seedEmployeeDatabase(done);
    });

    beforeEach('populute the timesheet table', function (done) {
      seed.seedTimesheetDatabase(done);
    });

    beforeEach('Get a timesheet from the database', async function () {
      timesheet = await Timesheet.get(1);
    });

    beforeEach('Delete the timesheet', async function () {
      deleteResult = await timesheet.delete();
    });

    it('deletes the timesheet from the database', function (done) {

      testDb.get(`SELECT *
      FROM Timesheet
      WHERE id = $timesheetId;`, {
        $timesheetId: timesheet.timesheetId
      }, function (err, row) {
        if (err) {
          done(err);
        } else {
          assert.isUndefined(row);
          done();
        }
      });
    });

    it('leaves the rest of the items in the database', function (done) {
      testDb.all(`SELECT *
      FROM Timesheet`, function (err, rows) {
        if (err) {
          done(err);
        } else {
          assert.lengthOf(rows, 2);
          done();
        }
      });
    });

    it('returns true after a successful delete', function () {
      assert.isTrue(deleteResult);
    });

  });

});

function createTimesheet() {
  return new Timesheet(timesheetTemplate);
}
