const express = require('express');
const Timesheet = require('../models/timesheet');
const Employee = require('../models/employee');
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  try {
    let timesheets = await Timesheet.getByEmployeeId(req.params.employeeId);
    res.send({ timesheets: timesheets });
  } catch (err) {
    if (err.message === 'Employee not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

router.post('/', async (req, res, next) => {
  try {
    req.body.timesheet.employeeId = req.params.employeeId;
    let timesheet = await new Timesheet(req.body.timesheet).create();
    return res.status(201).send({ timesheet: timesheet });

  } catch (err) {
    if (err.message === 'Employee not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

router.put('/:timesheetId/', async (req, res, next) => {
  try {
    let timesheet = await Timesheet.get(req.params.timesheetId);
    let updatedTimesheet = await Employee.get(req.params.employeeId).then(() => timesheet.update(req.body.timesheet), (err) => Promise.reject(err));
    return res.send({ timesheet: updatedTimesheet});
  } catch (err) {
    if(err.message === 'Employee not found' || err.message === 'Timesheet not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

router.delete('/:timesheetId/', async (req, res, next) => {
  try {
    let timesheet = await Timesheet.get(req.params.timesheetId);
    await Employee.get(req.params.employeeId).then(() => timesheet.delete(), (err) => Promise.reject(err));
    return res.status(204).send();
  } catch (err) {
    if(err.message === 'Employee not found' || err.message === 'Timesheet not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

module.exports = router;