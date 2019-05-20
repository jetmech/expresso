const express = require('express');
const MenuItem = require('../models/menuItem');
const Menu = require('../models/menu');
const router = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {

  MenuItem.getByMenuId(req.params.menuId)
    .then(menuItems => res.send({ menuItems: menuItems }))
    .catch(err => next(err));

});

router.post('/', (req, res, next) => {

  req.body.menuItem.menuId = req.params.menuId;
  let menuItem = new MenuItem(req.body.menuItem);
  menuItem.create()
    .then(createdMenuItem => res.status(201).send({ menuItem: createdMenuItem }))
    .catch(err => next(err));

});

router.put('/:menuItemId/', (req, res, next) => {

  Menu.getById(req.params.menuId)
    .then(() => MenuItem.get(req.params.menuItemId))
    .then(menuItem => menuItem.update(req.body.menuItem))
    .then(updatedMenuItem => res.send({ menuItem: updatedMenuItem }))
    .catch(err => next(err));

});

router.delete('/:menuItemId/', (req, res, next) => {

  MenuItem.get(req.params.menuItemId)
    .then(menuItem => menuItem.delete())
    .then(() => res.status(204).send())
    .catch(err => next(err));

});

module.exports = router;