'use strict';

// Weak maps are used to store instance properties.
const _id = new WeakMap();
const _name = new WeakMap();
const _description = new WeakMap();
const _inventory = new WeakMap();
const _price = new WeakMap();
const _menuId = new WeakMap();

const sqlite3 = require('sqlite3');
const Menu = require('./menu');

const { dbPath } = require('../../config');

// Custom errors
const { ExistenceError, PropertyError } = require('./errors');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err);
  }
});

const MenuItem = class {

  /**
   * Create an instance of menuItem.
   * Can take a JSON object from a resquest body or a row from the database.
   * @param {Object} menuItem - An object representing the menuItem.
   * @param {number} [menuItem.menuItemId] - The menuItem id.
   * @param {number} [menuItem.id] - The menuItem id. Used when constructing from a sqlite3 row object.
   * @param {string} menuItem.name - The name of the menuItem.
   * @param {string} menuItem.description - The description of the menuItem.
   * @param {number} menuItem.inventory - The number of items in stock.
   * @param {number} menuItem.price - The price of the item.
   * @param {number} [menuItem.menuId] - The id of the menu for the menuItem. Required if menu_id is undefined.
   * @param {number} [menuItem.menu_id] - The id of the menu for the menuItem. Used when constructing from a sqlite3 row object. Required if menuId is undefined.
   */
  constructor({ menuItemId, id, name, description, inventory, price, menuId, menu_id }) {
    this.menuItemId = menuItemId || id;
    this.name = name;
    this.description = description;
    this.inventory = inventory;
    this.price = price;
    this.menuId = menuId || menu_id;
  }

  /**
   * The menuItem id.
   * @type {number}
   * @throws {PropertyError} - If defined, must be an integer.
   */
  set menuItemId(id) {

    if (typeof id === 'undefined') {
      _id.set(this, undefined);
      return;
    } else if (typeof id === 'string' || typeof id === 'number') {
      id = Number.parseFloat(id);
    } else {
      throw new PropertyError('If defined, menuItemId must be an integer');
    }

    if (id && Number.isInteger(id)) {
      _id.set(this, id);
    } else {
      throw new PropertyError('If defined, menuItemId must be an integer');
    }
  }

  get menuItemId() {
    return _id.get(this);
  }

  /**
   * The menuItem name.
   * @type {string}
   * @throws {PropertyError} - Must be a string.
   */
  set name(name) {
    if (typeof name === 'string') {
      _name.set(this, name);
    } else {
      throw new PropertyError('Name must be a string');
    }
  }

  get name() {
    return _name.get(this);
  }

  /**
   * The menuItem description.
   * @type {string}
   * @throws {PropertyError} - If defined, must be a string.
   */
  set description(description) {
    if (typeof description === 'string') {
      _description.set(this, description);
    } else if (typeof description === 'undefined') {
      _description.set(this, undefined);
    }
    else {
      throw new PropertyError('If defined, description must be a string');
    }
  }

  get description() {
    return _description.get(this);
  }

  /**
   * The number of items available.
   * @type {number}
   * @throws {PropertyError} - Must be an integer.
   */
  set inventory(inventory) {

    if (typeof inventory === 'string' || typeof inventory === 'number') {
      inventory = Number.parseFloat(inventory);
    } else {
      throw new PropertyError('inventory must be an integer');
    }

    if (inventory && Number.isInteger(inventory)) {
      _inventory.set(this, inventory);
    } else {
      throw new PropertyError('inventory must be an integer');
    }
  }

  get inventory() {
    return _inventory.get(this);
  }

  /**
   * The price of the item.
   * @type {number}
   * @throws {PropertyError} - Must be a number.
   */
  set price(price) {

    if (typeof price === 'string' || typeof price === 'number') {
      price = Number.parseFloat(price);
    } else {
      throw new PropertyError('price must be a number');
    }

    if (!isNaN(price)) {
      _price.set(this, price);
    } else {
      throw new PropertyError('price must be a number');
    }

  }

  get price() {
    return _price.get(this);
  }

  /**
   * The id of the menu the item belongs to.
   * @type {number}
   * @throws {PropertyError} - Must be an integer.
   */
  set menuId(menuId) {

    if (typeof menuId === 'string' || typeof menuId === 'number') {
      menuId = Number.parseFloat(menuId);
    } else {
      throw new PropertyError('menuId must be an integer');
    }

    if (menuId && Number.isInteger(menuId)) {
      _menuId.set(this, menuId);
    } else {
      throw new PropertyError('menuId must be an integer');
    }
  }

  get menuId() {
    return _menuId.get(this);
  }

  /**
   * Get a menu's menuItems from the database.
   * @param {(string|number)} menuId - The id of the menu.
   * @returns {Promise<MenuItems[]>} Returns a promise for an array of menuItems.
   * @throws {ExistenceError} Rejects with an ExistenceError if the menu is not found.
   */
  static getByMenuId(menuId) {
    let menuItemPromise = new Promise((resolve, reject) => {
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

    return Menu.getById(menuId)
      .then(() => menuItemPromise);
  }

  /**
   * Get a menuItem from the database.
   * @param {(string|number)} menuItemId - The id of the menuItem to retrieve.
   * @returns {Promise<MenuItem>} Returns a promise for a menuItme.
   * @throws {ExistenceError} Rejects with an ExistenceError if the menuItem is not found.
   */
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
          return reject(new ExistenceError('MenuItem not found'));
        }
      });
    });
  }

  /**
   * Add this instance of menuItem to the database.
   * @returns {Promise<Timesheet>} Returns a promise for the instance of menuItem that has just been added.
   * @throws {ExistenceError} Rejects with an ExistenceError if the menu associated with the menuItem is not found in the database.
   */
  create() {
    const createPromise = () => new Promise((resolve, reject) => {
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
    });

    return Menu.getById(this.menuId)
      .then(createPromise)
      .then(id => MenuItem.get(id));
  }

  /**
   * Update this instance of menuItem in the database.
   * @param {Object} newPropertyValues An object from a request body that contains the updated properties.
   * @param {string} newPropertyValues.name The updated name.
   * @param {string} newPropertyValues.description The updated description.
   * @param {Object} newPropertyValues.inventory The updated invventory.
   * @param {Object} newPropertyValues.price The updated price.
   * @returns {Promise<Timesheet>} Returns a promise for the instance of timesheet that has just been updated.
   * @throws {PropertyError} Rejects with a PropertyError if any of the properties are invalid.
   */
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

    return updatePromise.then(id => MenuItem.get(id));
  }

  /**
   * Delete this instance of menuItem from the database.
   */
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
          return resolve();
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

module.exports = MenuItem;
