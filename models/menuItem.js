'use strict';

const _id = new WeakMap();
const _name = new WeakMap();
const _description = new WeakMap();
const _inventory = new WeakMap();
const _price = new WeakMap();
const _menuId = new WeakMap();

const sqlite3 = require('sqlite3');
const Menu = require('./menu');

const { dbPath } = require('../config');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err);
  }
});

module.exports = class MenuItem {
  constructor({ menuItemId, id, name, description, inventory, price, menuId, menu_id }) {
    this.menuItemId = menuItemId || id;
    this.name = name;
    this.description = description;
    this.inventory = inventory;
    this.price = price;
    this.menuId = menuId || menu_id;
  }

  set menuItemId(id) {

    if (typeof id === 'undefined') {
      _id.set(this, undefined);
      return;
    } else if (typeof id === 'string' || typeof id === 'number') {
      id = Number.parseFloat(id);
    } else {
      throw TypeError('If defined, menuItemId must be an integer');
    }

    if (id && Number.isInteger(id)) {
      _id.set(this, id);
    } else {
      throw TypeError('If defined, menuItemId must be an integer');
    }
  }

  get menuItemId() {
    return _id.get(this);
  }

  /**
   * @throws {TypeError} Blah
   */
  set name(name) {
    if (typeof name === 'string') {
      _name.set(this, name);
    } else {
      throw TypeError('Name must be a string');
    }
  }

  get name() {
    return _name.get(this);
  }

  set description(description) {
    if (typeof description === 'string') {
      _description.set(this, description);
    } else if (typeof description === 'undefined') {
      _description.set(this, undefined);
    }
    else {
      throw TypeError('If defined, description must be a string');
    }
  }

  get description() {
    return _description.get(this);
  }

  set inventory(inventory) {

    if (typeof inventory === 'string' || typeof inventory === 'number') {
      inventory = Number.parseFloat(inventory);
    } else {
      throw TypeError('inventory must be an integer');
    }

    if (inventory && Number.isInteger(inventory)) {
      _inventory.set(this, inventory);
    } else {
      throw TypeError('inventory must be an integer');
    }
  }

  get inventory() {
    return _inventory.get(this);
  }

  set price(price) {

    if (typeof price === 'string' || typeof price === 'number') {
      price = Number.parseFloat(price);
    } else {
      throw TypeError('price must be a number');
    }

    if (!isNaN(price)) {
      _price.set(this, price);
    } else {
      throw TypeError('price must be a number');
    }

  }

  get price() {
    return _price.get(this);
  }

  set menuId(menuId) {

    if (typeof menuId === 'string' || typeof menuId === 'number') {
      menuId = Number.parseFloat(menuId);
    } else {
      throw TypeError('menuId must be an integer');
    }

    if (menuId && Number.isInteger(menuId)) {
      _menuId.set(this, menuId);
    } else {
      throw TypeError('menuId must be an integer');
    }
  }

  get menuId() {
    return _menuId.get(this);
  }

  static async getByMenuId(menuId) {
    let menuPromise = new Promise((resolve, reject) => {
      db.all(`SELECT *
      FROM MenuItem
      WHERE menu_id = $menuId;`, {
        $menuId: menuId
      },
      (err, row) => {
        if (err) {
          return reject(err);
        } else {
          let result = [];
          row.forEach(menuItem => result.push(new MenuItem(menuItem)));
          return resolve(result);
        }
      });
    });

    try {
      let menu = await Menu.get(menuId);
      if (menu) {
        return menuPromise;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static get(menuItemId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM MenuItem WHERE id = $menuItemId;', {
        $menuItemId: menuItemId
      }, function (err, row) {
        if (err) {
          return reject(err);
        } else if (row) {
          try {
            let menuItem = new MenuItem(row);
            return resolve(menuItem);
          } catch (err) {
            return reject(err);
          }
        } else {
          return reject(new RangeError('MenuItem not found'));
        }
      });
    });
  }

  /**
   * @returns {Promise<MenuItem>}
   */
  async create() {
    const createPromise = new Promise((resolve, reject) => {
      db.run(`INSERT INTO MenuItem (
        name,
        description,
        inventory,
        price,
        menu_id)
      VALUES (
        $name,
        $description,
        $inventory,
        $price,
        $menuId
      )`, {
        $name: this.name,
        $description: this.description,
        $inventory: this.inventory,
        $price: this.price,
        $menuId: this.menuId
      }, function (err) {
        if (err) {
          return reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    }).then((id) => MenuItem.get(id), (err) => Promise.reject(err));

    try {
      let employee = await Menu.get(this.menuId);
      if (employee) {
        return createPromise;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  update(newPropertyValues) {
    const updatePromise = new Promise((resolve, reject) => {

      // This will validate the request body values using existing class logic.
      try {
        this.name = newPropertyValues.name;
        this.description = newPropertyValues.description;
        this.inventory = newPropertyValues.inventory;
        this.price = newPropertyValues.price;
      } catch (err) {
        return reject(err);
      }

      db.run(`UPDATE MenuItem
        SET 
          name = $name,
          description = $description,
          inventory = $inventory,
          price = $price
        WHERE id = $menuItemId;`, {
        $menuItemId: this.menuItemId,
        $name: this.name,
        $description: this.description,
        $inventory: this.inventory,
        $price: this.price
      }, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(this.menuItemId);
        }
      });
    });

    return updatePromise.then((id) => MenuItem.get(id), (err) => Promise.reject(err));
  }

  delete() {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM
      MenuItem
      WHERE id = $menuItemId;`, {
        $menuItemId: this.menuItemId,
      }, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(true);
        }
      });
    });
  }

  toJSON() {
    return {
      id: this.menuItemId,
      name: this.name,
      description: this.description,
      inventory: this.inventory,
      price: this.price,
      menu_id: this.menuId
    };
  }
};
