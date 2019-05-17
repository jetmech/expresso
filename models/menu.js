'use strict';

const _id = new WeakMap();
const _title = new WeakMap();

const sqlite3 = require('sqlite3');

const { dbPath } = require('../config');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err);
  }
});

module.exports = class Menu {
  constructor({ menuId, id, title }) {
    this.menuId = id || menuId;
    this.title = title;
  }

  set menuId(id) {

    if (typeof id === 'undefined') {
      _id.set(this, undefined);
      return;
    } else if (typeof id === 'string' || typeof id === 'number') {
      id = Number.parseFloat(id);
    } else {
      throw TypeError('If defined, menuId must be an integer');
    }

    if (id && Number.isInteger(id)) {
      _id.set(this, id);
    } else {
      throw TypeError('If defined, menuId must be an integer');
    }
  }

  get menuId() {
    return _id.get(this);
  }

  set title(name) {
    if (typeof name === 'string') {
      _title.set(this, name);
    } else {
      throw TypeError('Name must be a string');
    }
  }

  get title() {
    return _title.get(this);
  }

  static get(menuId) {
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
          return reject(new RangeError('Menu not found'));
        }
      });
    });
  }

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
    }).then((id) => Menu.get(id), (err) => Promise.reject(err));
  }

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
          return resolve(this.menuId);
        }
      });
    });

    return updatePromise.then((id) => Menu.get(id), (err) => Promise.reject(err));
  }

  delete() {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM
      Menu
      WHERE id = $menuId;`, {
        $menuId: this.menuId,
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
      id: this.menuId,
      title: this.title
    };
  }

};
