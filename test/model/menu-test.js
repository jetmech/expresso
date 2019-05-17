'use strict';

const { assert } = require('chai');
const sqlite3 = require('sqlite3');

const Menu = require('../../models/menu');
let menu = {};
let menus = [];

const seed = require('./../seed');

const menuTemplate = {
  menuId: 1,
  title: 'Breakfast'
};

const testDb = new sqlite3.Database(process.env.TEST_DATABASE);

describe('.constructor', function () {

  beforeEach('Creater an instance of Menu', function () {
    menu = createMenu();
  });

  it('returns a Menu object', function () {
    assert.instanceOf(menu, Menu);
  });
});

describe('#menuId', function () {

  beforeEach('Create an instance of Menu', function () {
    menu = createMenu();
  });

  it('is a number', function () {
    assert.isNumber(menu.menuId);
  });

  it('can be undefined', function () {
    function shouldNotThrow() {
      menu.menuId = undefined;
    }
    assert.doesNotThrow(shouldNotThrow);
  });

  it('throws an error if set to a non-number', function () {
    let nonNumber = 'Hello, I am not a number...';
    function shouldThrow() {
      menu.menuId = nonNumber;
    }
    assert.throws(shouldThrow);
  });

  it('throws an error if set to a non-integer', function () {
    let nonInteger = 42.42;
    function shouldThrow() {
      menu.menuId = nonInteger;
    }
    assert.throws(shouldThrow);
  });

});

describe('#title', function () {

  beforeEach('Create an instance of Employee', function () {
    menu = createMenu();
  });

  it('is a string', function () {
    assert.isString(menu.title);
  });

  it('throws an error if set to a non-string value', function () {
    let nonString = 42;
    function shouldThrow() {
      menu.title = nonString;
    }
    assert.throws(shouldThrow);
  });
});

describe('.get()', function () {

  beforeEach('populute the menu table', function (done) {
    seed.seedMenuDatabase(done);
  });

  beforeEach('get the menu', async function () {
    menu = await Menu.get(1);
  });

  it('returns a Menu object', function () {
    assert.instanceOf(menu, Menu);
  });

  it('the returned object has the correct property values', function () {
    assert.deepPropertyVal(menu, 'menuId', 1);
    assert.deepPropertyVal(menu, 'title', 'Breakfast');
  });

});

describe('.getAll()', function () {

  beforeEach('populute the menu table', function (done) {
    seed.seedMenuDatabase(done);
  });

  beforeEach('get the menu', async function () {
    menus = await Menu.getAll();
  });

  it('returns an array', function () {
    assert.isArray(menus);
  });

  it('the returned array has the correct length', function () {
    assert.lengthOf(menus, 3);
  });

  it('each item in the array is a instance of Menu', function () {
    menus.forEach(menu => assert.instanceOf(menu, Menu));
  });

});

describe('#create()', function () {

  let newMenu;

  beforeEach('populute the menu table', function (done) {
    seed.seedMenuDatabase(done);
  });

  beforeEach('Create an instance of Menu', function () {
    menu = createMenu();
  });

  beforeEach('Add the menu to the database', async function () {
    newMenu = await menu.create();
  });

  it('adds the employee to the database', function (done) {

    testDb.get(`SELECT *
    FROM Menu
    WHERE id = $menuId;`, {
      $menuId: newMenu.menuId
    }, function (err, row) {
      if (err) {
        done(err);
      } else if (row) {
        assert.equal(newMenu.menuId, row.id);
        done();
      } else {
        assert.fail();
      }
    });
  });

  it('returns a menu object after a successful creation', function () {
    assert.instanceOf(newMenu, Menu);
  });

  it('the returned object has the correct property values', function () {
    assert.deepPropertyVal(newMenu, 'menuId', 4);
    assert.deepPropertyVal(newMenu, 'title', 'Breakfast');
  });

});

describe('#update()', function () {

  let updatedMenu;
  let updatedProperties = {
    title: 'Updated Breakfast'
  };

  beforeEach('populute the menu table', function (done) {
    seed.seedMenuDatabase(done);
  });

  beforeEach('Get a menu from the database', async function () {
    menu = await Menu.get(1);
  });

  beforeEach('Update the menu', async function () {
    updatedMenu = await menu.update(updatedProperties);
  });

  it('updates the menu in the database', function (done) {

    testDb.get(`SELECT *
    FROM Menu
    WHERE id = $menuId;`, {
      $menuId: updatedMenu.menuId
    }, function (err, row) {
      if (err) {
        done(err);
      } else if (row) {
        assert.strictEqual(row.id, 1);
        assert.strictEqual(row.title, 'Updated Breakfast');
        done();
      } else {
        assert.fail();
      }
    });
  });

  it('returns a menu object after a successful update', function () {
    assert.instanceOf(updatedMenu, Menu);
  });

  it('the returned object has the correct property values', function () {
    assert.deepPropertyVal(updatedMenu, 'menuId', 1);
    assert.deepPropertyVal(updatedMenu, 'title', 'Updated Breakfast');
  });

});

describe('#delete()', function () {

  let deleteResult;

  beforeEach('populute the menu table', function (done) {
    seed.seedMenuDatabase(done);
  });

  beforeEach('Get a menu from the database', async function () {
    menu = await Menu.get(1);
  });

  beforeEach('Delete the menu', async function () {
    deleteResult = await menu.delete();
  });

  it('deletes the menu from the database', function (done) {

    testDb.get(`SELECT *
    FROM Menu
    WHERE id = $menuId;`, {
      $menuId: menu.menuId
    }, function (err, row) {
      if (err) {
        done(err);
      } else {
        assert.isUndefined(row);
        done();
      }
    });
  });

  it('leaves the rest of the items in the database', function (done) {
    testDb.all(`SELECT *
    FROM Menu`, function (err, rows) {
      if (err) {
        done(err);
      } else {
        assert.lengthOf(rows, 2);
        done();
      }
    });
  });

  it('returns true after a successful delete', function () {
    assert.isTrue(deleteResult);
  });

});

function createMenu() {
  return new Menu(menuTemplate);
}
