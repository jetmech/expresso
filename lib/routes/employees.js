'use strict';

/* eslint-disable no-unused-vars */
const express = require('express');
const Employee = require('../models/employee');
const timesheetRouter = require('./timesheets');
const router = express.Router();

router.get('/', (req, res, next) => {

  Employee.getCurrentlyEmployed()
    .then(employees => res.send({ employees: employees }))
    .catch(err => next(err));

});

router.post('/', (req, res, next) => {

  let newEmployee = new Employee(req.body.employee);
  newEmployee.create()
    .then(createdEmployee => res.status(201).send({ employee: createdEmployee }))
    .catch(err => next(err));

});

router.get('/:employeeId', (req, res, next) => {

  Employee.get(req.params.employeeId)
    .then(employee => res.send({ employee: employee }))
    .catch(err => next(err));

});

router.put('/:employeeId', (req, res, next) => {

  Employee.get(req.params.employeeId)
    .then(employee => employee.update(req.body.employee))
    .then(updatedEmployee => res.send({ employee: updatedEmployee }))
    .catch(err => next(err));

});

router.delete('/:employeeId', (req, res, next) => {

  Employee.get(req.params.employeeId)
    .then(employee => employee.delete())
    .then(deletedEmployee => res.send({ employee: deletedEmployee }))
    .catch(err => next(err));

});

router.use('/:employeeId/timesheets/', timesheetRouter);

module.exports = router;
