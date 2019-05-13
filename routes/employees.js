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

module.exports = router;
