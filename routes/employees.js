/* eslint-disable no-unused-vars */
const express = require('express');
const Employee = require('../models/employee');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const employees = await Employee.getCurrentlyEmployed();
    return res.send({ employees: employees });
  } catch (error) {
    return res.status(500).send();
  }
});

router.post('/', async (req, res, next) => {
  try {
    let newEmployee = await new Employee(req.body.employee).create();
    return res.status(201).send({ employee: newEmployee });
  } catch (err) {
    return res.status(400).send();
  }
});

router.get('/:employeeId', async (req, res, next) => {
  try {
    const employee = await Employee.get(req.params.employeeId);
    return res.send({ employee: employee });
  } catch (err) {
    if (err.message === 'Employee not found') {
      return res.status(404).send();
    } else {
      res.status(400).send();
    }
  }
});

router.put('/:employeeId', async (req, res, next) => {
  try {
    const employee = await Employee.get(req.params.employeeId);
    const updatedEmployee = await employee.update(req.body.employee);
    return res.send({ employee: updatedEmployee });
  } catch (err) {
    if (err.message === 'Employee not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

router.delete('/:employeeId', async (req, res, next) => {
  try {
    const employee = await Employee.get(req.params.employeeId);
    const deletedEmployee = await employee.delete();
    return res.send({ employee: deletedEmployee });
  } catch (err) {
    if (err.message === 'Employee not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

module.exports = router;
