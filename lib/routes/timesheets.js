'use strict';

const express = require('express');
const Timesheet = require('../models/timesheet');
const Employee = require('../models/employee');
const router = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {

  Timesheet.getByEmployeeId(req.params.employeeId)
    .then(timesheets => res.send({ timesheets: timesheets }))
    .catch(err => next(err));

});

router.post('/', (req, res, next) => {

  req.body.timesheet.employeeId = req.params.employeeId;
  let timesheet = new Timesheet(req.body.timesheet);
  timesheet.create()
    .then(timesheet => res.status(201).send({ timesheet: timesheet }))
    .catch(err => next(err));

});

router.put('/:timesheetId/', (req, res, next) => {

  Employee.get(req.params.employeeId)
    .then(() => Timesheet.get(req.params.timesheetId))
    .then(timesheet => timesheet.update(req.body.timesheet))
    .then(updatedTimesheet => res.send({ timesheet: updatedTimesheet }))
    .catch(err => next(err));

});

router.delete('/:timesheetId/', (req, res, next) => {

  Timesheet.get(req.params.timesheetId)
    .then(timesheet => timesheet.delete())
    .then(() => res.status(204).send())
    .catch(err => next(err));

});

module.exports = router;