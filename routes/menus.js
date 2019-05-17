/* eslint-disable no-unused-vars */
const express = require('express');
const Menu = require('../models/menu');
const MenuItem = require('../models/menuItem');
const menuItemRouter = require('./menuItems');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const menus = await Menu.getAll();
    return res.send({ menus: menus });
  } catch (error) {
    return res.status(500).send();
  }
});

router.post('/', async (req, res, next) => {
  try {
    let newMenu = await new Menu(req.body.menu).create();
    return res.status(201).send({ menu: newMenu });
  } catch (err) {
    return res.status(400).send();
  }
});

router.get('/:menuId', async (req, res, next) => {
  try {
    const menu = await Menu.get(req.params.menuId);
    return res.send({ menu: menu });
  } catch (err) {
    if (err.message === 'Menu not found') {
      return res.status(404).send();
    } else {
      res.status(400).send();
    }
  }
});

router.put('/:menuId', async (req, res, next) => {
  try {
    const menu = await Menu.get(req.params.menuId);
    const updatedMenu = await menu.update(req.body.menu);
    return res.send({ menu: updatedMenu });
  } catch (err) {
    if (err.message === 'Menu not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

router.delete('/:menuId', async (req, res, next) => {
  try {
    const MenuItems = await MenuItem.getByMenuId(req.params.menuId);
    if (MenuItems.length > 0) {
      return res.status(400).send();
    } else {
      const menu = await Menu.get(req.params.menuId);
      const deletedMenu = await menu.delete();
      return res.status(204).send({ menu: deletedMenu });
    }
  } catch (err) {
    if (err.message === 'Menu not found') {
      return res.status(404).send();
    } else {
      return res.status(400).send();
    }
  }
});

router.use('/:menuId/menu-items/', menuItemRouter);

module.exports = router;
