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

module.exports = router;
