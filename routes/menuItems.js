const express = require('express');
const MenuItem = require('../models/menuItem');
const Menu = require('../models/menu');
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  try {
    let menuItems = await MenuItem.getByMenuId(req.params.menuId);
    res.send({ menuItems: menuItems });
  } catch (err) {
    if (err.message === 'Menu not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

router.post('/', async (req, res, next) => {
  try {
    req.body.menuItem.menuId = req.params.menuId;
    let menuItem = await new MenuItem(req.body.menuItem).create();
    return res.status(201).send({ menuItem: menuItem });

  } catch (err) {
    if (err.message === 'Menu not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

router.put('/:menuItemId/', async (req, res, next) => {
  try {
    let menuItem = await MenuItem.get(req.params.menuItemId);
    let updatedMenuItem = await Menu.get(req.params.menuId).then(() => menuItem.update(req.body.menuItem), (err) => Promise.reject(err));
    return res.send({ menuItem: updatedMenuItem });
  } catch (err) {
    if (err.message === 'Menu not found' || err.message === 'MenuItem not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

router.delete('/:menuItemId/', async (req, res, next) => {
  try {
    let menuItem = await MenuItem.get(req.params.menuItemId);
    await Menu.get(req.params.menuId).then(() => menuItem.delete(), (err) => Promise.reject(err));
    return res.status(204).send();
  } catch (err) {
    if (err.message === 'Menu not found' || err.message === 'MenuItem not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

module.exports = router;