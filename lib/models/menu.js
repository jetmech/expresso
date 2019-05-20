'use strict';

// Weak maps are used to store instance properties.
const _id = new WeakMap();
const _title = new WeakMap();

const sqlite3 = require('sqlite3');

const { dbPath } = require('../../config');

// Custom errors
const { ExistenceError, PropertyError } = require('./errors');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err);
  }
});

const Menu = class {

  /**
   * Create an instance of menu.
   * Can take a JSON object from a resquest body or a row from the database.
   * @param {Object} menu - An object representing the menu.
   * @param {number} [menu.menuId] - The menu id.
   * @param {number} [menu.id] - The menu id. Used when constructing from a sqlite3 row object.
   * @param {string} menu.title - The name of the menu.
   */
  constructor({ menuId, id, title }) {
    this.menuId = id || menuId;
    this.title = title;
  }

  /**
   * The menu id.
   * @type {number}
   * @throws {PropertyError} - If defined, must be an integer.
   */
  set menuId(id) {

    if (typeof id === 'undefined') {
      _id.set(this, undefined);
      return;
    } else if (typeof id === 'string' || typeof id === 'number') {
      id = Number.parseFloat(id);
    } else {
      throw new PropertyError('If defined, menuId must be an integer');
    }

    if (id && Number.isInteger(id)) {
      _id.set(this, id);
    } else {
      throw new PropertyError('If defined, menuId must be an integer');
    }
  }

  get menuId() {
    return _id.get(this);
  }

  /**
   * The menu title.
   * @type {string}
   * @throws {PropertyError} - Must be a string.
   */
  set title(name) {
    if (typeof name === 'string') {
      _title.set(this, name);
    } else {
      throw new PropertyError('Name must be a string');
    }
  }

  get title() {
    return _title.get(this);
  }

  /**
   * Get a menu from the database.
   * @param {(string|number)} menuId - The id of the menu to retrieve.
   * @returns {Promise<Menu>} Returns a promise for a menu.
   * @throws {ExistenceError} Rejects with an ExistenceError if the menu is not found.
   */
  static getById(menuId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Menu WHERE id = $menuId;', {
        $menuId: menuId
      }, function (err, row) {
        if (err) {
          return reject(err);
        } else if (row) {
          try {
            let menu = new Menu(row);
            return resolve(menu);
          } catch (err) {
            return reject(err);
          }
        } else {
          return reject(new ExistenceError('Menu not found'));
        }
      });
    });
  }

  /**
   * Get all the menus from the database
   * @returns {Promise<Menu[]>}
   */
  static getAll() {
    let menus = [];
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Menu', (err, rows) => {
        if (err) {
          return reject(err);
        } else {
          rows.forEach(row => menus.push(new Menu(row)));
          return resolve(menus);
        }
      });
    });
  }

  /**
   * Add this instance of employee to the database.
   * @returns {Promise<Menu>} Returns a promise for the instance of menu that has just been added.
   */
  create() {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO Menu (
        title)
      VALUES (
        $title
      )`, {
        $title: this.title
      }, function (err) {
        if (err) {
          return reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    }).then((id) => Menu.getById(id));
  }

  /**
   * Update this instance of menu in the database.
   * @param {Object} newPropertyValues An object from a request body that contains the updated properties.
   * @param {Object} newPropertyValues.title The updated title.
   * @returns {Promise<Menu>} Returns a promise for the instance of employee that has just been updated.
   * @throws {PropertyError} Rejects with a PropertyError if any of the properties are invalid.
   */
  update(newPropertyValues) {
    const updatePromise = new Promise((resolve, reject) => {

      // This will validate the request body values using existing class logic.
      try {
        this.title = newPropertyValues.title;
      } catch (err) {
        return reject(err);
      }

      db.run(`UPDATE Menu
        SET 
          title = $title
        WHERE id = $id;`, {
        $id: this.menuId,
        $title: this.title
      }, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });

    return updatePromise.then(() => Menu.getById(this.menuId));
  }

  /**
   * Delete this instance of menu from the database.
   * @throws {ExistenceError} error.message will be 'menu has associated menuItems' if the menu has related menuItems in the database.
   */
  delete() {
    const menuItemPromise = new Promise((resolve, reject) => {
      db.all(`SELECT *
      FROM MenuItem
      WHERE menu_id = $menuId`, {
        $menuId: this.menuId
      }, (err, rows) => {
        if (err) {
          return reject(err);
        } else if (rows.length > 0) {
          return reject(new ExistenceError('menu has associated menuItems'));
        } else {
          return resolve();
        }
      });
    });

    const deletePromise = () => new Promise((resolve, reject) => {
      db.run(`DELETE FROM
      Menu
      WHERE id = $menuId;`, {
        $menuId: this.menuId,
      }, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });

    return menuItemPromise.then(deletePromise);

  }

  toJSON() {
    return {
      id: this.menuId,
      title: this.title
    };
  }
};

module.exports = Menu;
