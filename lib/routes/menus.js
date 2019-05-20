'use strict';

const express = require('express');
const Menu = require('../models/menu');
const MenuItem = require('../models/menuItem');
const menuItemRouter = require('./menuItems');
const router = express.Router();

router.get('/', (req, res, next) => {

  Menu.getAll().then(menus => res.send({ menus: menus }))
    .catch(err => next(err));

});

router.post('/', (req, res, next) => {

  let newMenu = new Menu(req.body.menu);
  newMenu.create()
    .then(createdMenu => res.status(201).send({ menu: createdMenu }))
    .catch(err => next(err));

});

router.get('/:menuId', (req, res, next) => {

  Menu.getById(req.params.menuId)
    .then(menu => res.send({ menu: menu }))
    .catch(err => next(err));

});

router.put('/:menuId', (req, res, next) => {

  Menu.getById(req.params.menuId)
    .then(menu => menu.update(req.body.menu))
    .then(updatedMenu => res.send({ menu: updatedMenu }))
    .catch(err => next(err));

});

router.delete('/:menuId', (req, res, next) => {

  Menu.getById(req.params.menuId)
    .then(menu => menu.delete())
    .then(() => res.status(204).send())
    .catch(err => next(err));

});

router.use('/:menuId/menu-items/', menuItemRouter);

module.exports = router;
