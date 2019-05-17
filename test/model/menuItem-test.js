'use strict';

const { assert } = require('chai');
const sqlite3 = require('sqlite3');

const MenuItem = require('../../models/menuItem');
let menuItem = {};
let menuItems = [];

const seed = require('./../seed');

const menuItemTemplate = {
  menuItemId: 1,
  name: 'Menu 1 Item 1 Name',
  description: 'Menu 1 Item 1 Description',
  inventory: 10,
  price: 2.5,
  menuId: 1,
};

const testDb = new sqlite3.Database(process.env.TEST_DATABASE);

describe('MenuItem', function () {

  describe('.constructor', function () {

    beforeEach('Create an instance of MenuItem', function () {
      menuItem = createMenuItem();
    });

    it('returns a MenuItem object', function () {
      assert.instanceOf(menuItem, MenuItem);
    });
  });

  describe('#menuItemId', function () {

    beforeEach('Create an instance of MenuItem', function () {
      menuItem = createMenuItem();
    });

    it('is a number', function () {
      assert.isNumber(menuItem.menuItemId);
    });

    it('can be undefined', function () {
      function shouldNotThrow() {
        menuItem.menuItemId = undefined;
      }
      assert.doesNotThrow(shouldNotThrow);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        menuItem.menuItemId = nonNumber;
      }
      assert.throws(shouldThrow);
    });

    it('throws an error if set to a non-integer', function () {
      let nonInteger = 42.42;
      function shouldThrow() {
        menuItem.menuItemId = nonInteger;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('#name', function () {

    beforeEach('Create an instance of MenuItem', function () {
      menuItem = createMenuItem();
    });

    it('is a string', function () {
      assert.isString(menuItem.name);
    });

    it('throws an error if set to a non-string value', function () {
      let nonString = 42;
      function shouldThrow() {
        menuItem.name = nonString;
      }
      assert.throws(shouldThrow);
    });
  });

  describe('#description', function () {

    beforeEach('Create an instance of MenuItem', function () {
      menuItem = createMenuItem();
    });

    it('is a string', function () {
      assert.isString(menuItem.name);
    });

    it('can be undefined', function () {
      function shouldNotThrow() {
        menuItem.description = undefined;
      }
      assert.doesNotThrow(shouldNotThrow);
    });

    it('throws an error if set to a non-string value', function () {
      let nonString = 42;
      function shouldThrow() {
        menuItem.name = nonString;
      }
      assert.throws(shouldThrow);
    });
  });

  describe('#inventory', function () {

    beforeEach('Create an instance of MenuItem', function () {
      menuItem = createMenuItem();
    });

    it('is a number', function () {
      assert.isNumber(menuItem.inventory);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        menuItem.inventory = nonNumber;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('#price', function () {

    beforeEach('Create an instance of MenuItem', function () {
      menuItem = createMenuItem();
    });

    it('is a number', function () {
      assert.isNumber(menuItem.price);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        menuItem.price = nonNumber;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('#menuId', function () {

    beforeEach('Create an instance of MenuItem', function () {
      menuItem = createMenuItem();
    });

    it('is a number', function () {
      assert.isNumber(menuItem.menuId);
    });

    it('throws an error if set to a non-number', function () {
      let nonNumber = 'Hello, I am not a number...';
      function shouldThrow() {
        menuItem.menuId = nonNumber;
      }
      assert.throws(shouldThrow);
    });

    it('throws an error if set to a non-integer', function () {
      let nonInteger = 42.42;
      function shouldThrow() {
        menuItem.menuId = nonInteger;
      }
      assert.throws(shouldThrow);
    });

  });

  describe('.getByMenuId()', function () {

    beforeEach('populate the Menu table', function (done) {
      seed.seedMenuDatabase(done);
    });

    beforeEach('populate the MenuItem table', function (done) {
      seed.seedMenuItemDatabase(done);
    });

    beforeEach('get the menuItems', async function () {
      menuItems = await MenuItem.getByMenuId(1);
    });

    it('retrurns an array', async function () {
      assert.isArray(menuItems);
    });

    it('each element is a MenuItem object', async function () {
      menuItems.forEach(menuItem => assert.instanceOf(menuItem, MenuItem));
    });

    it('returns the correct number of menuItems', function () {
      assert.lengthOf(menuItems, 2);
    });

  });

  describe('.get()', function () {

    beforeEach('populate the Menu table', function (done) {
      seed.seedMenuDatabase(done);
    });

    beforeEach('populate the MenuItem table', function (done) {
      seed.seedMenuItemDatabase(done);
    });

    beforeEach('get the menuItem', async function () {
      menuItem = await MenuItem.get(1);
    });

    it('returns a MenuItem object', function () {
      assert.instanceOf(menuItem, MenuItem);
    });

    it('the returned object has the correct property values', function () {
      assert.deepPropertyVal(menuItem, 'menuItemId', 1);
      assert.deepPropertyVal(menuItem, 'name', 'Menu 1 Item 1 Name');
      assert.deepPropertyVal(menuItem, 'description', 'Menu 1 Item 1 Description');
      assert.deepPropertyVal(menuItem, 'inventory', 10);
      assert.deepPropertyVal(menuItem, 'price', 2.5);
      assert.deepPropertyVal(menuItem, 'menuId', 1);
    });

  });

  describe('#create()', function () {

    let newMenuItem;

    beforeEach('populate the Menu table', function (done) {
      seed.seedMenuDatabase(done);
    });

    beforeEach('populate the MenuItem table', function (done) {
      seed.seedMenuItemDatabase(done);
    });

    beforeEach('create an instance of MenuItem', function () {
      menuItem = createMenuItem();
    });

    beforeEach('Add the menuItem to the database', async function () {
      newMenuItem = await menuItem.create();
    });

    it('adds the menuItem to the database', function (done) {

      testDb.get(`SELECT *
      FROM MenuItem
      WHERE id = $menuItemId;`, {
        $menuItemId: newMenuItem.menuItemId
      }, function (err, row) {
        if (err) {
          done(err);
        } else if (row) {
          assert.equal(newMenuItem.menuItemId, row.id);
          done();
        } else {
          assert.fail();
        }
      });
    });

    it('returns a MenuItem object after a successful creation', function () {
      assert.instanceOf(newMenuItem, MenuItem);
    });

    it('the returned object has the correct property values', function () {
      assert.deepPropertyVal(newMenuItem, 'menuItemId', 4);
      assert.deepPropertyVal(newMenuItem, 'name', 'Menu 1 Item 1 Name');
      assert.deepPropertyVal(newMenuItem, 'description', 'Menu 1 Item 1 Description');
      assert.deepPropertyVal(newMenuItem, 'inventory', 10);
      assert.deepPropertyVal(newMenuItem, 'price', 2.5);
      assert.deepPropertyVal(newMenuItem, 'menuId', 1);
    });

  });

  describe('#update()', function () {

    let updatedMenuItem;
    let updatedProperties = {
      name: 'Menu 1 Item 1 New Name',
      description: 'Menu 1 Item 1 New Description',
      inventory: 11,
      price: 2.55
    };

    beforeEach('populate the Menu table', function (done) {
      seed.seedMenuDatabase(done);
    });

    beforeEach('populate the MenuItem table', function (done) {
      seed.seedMenuItemDatabase(done);
    });

    beforeEach('Get a menuItem from the database', async function () {
      menuItem = await MenuItem.get(1);
    });

    beforeEach('Update the menuItem', async function () {
      updatedMenuItem = await menuItem.update(updatedProperties);
    });

    it('updates the menuItem in the database', function (done) {

      testDb.get(`SELECT *
      FROM MenuItem
      WHERE id = $menuItemId;`, {
        $menuItemId: updatedMenuItem.menuItemId
      }, function (err, row) {
        if (err) {
          done(err);
        } else if (row) {
          assert.strictEqual(row.id, 1);
          assert.strictEqual(row.name, 'Menu 1 Item 1 New Name');
          assert.strictEqual(row.description, 'Menu 1 Item 1 New Description');
          assert.strictEqual(row.inventory, 11);
          assert.strictEqual(row.price, 2.55);
          assert.strictEqual(row.menu_id, 1);
          done();
        } else {
          assert.fail();
        }
      });
    });

    it('returns a MenuItem object after a successful update', function () {
      assert.instanceOf(updatedMenuItem, MenuItem);
    });

    it('the returned object has the correct property values', function () {
      assert.deepPropertyVal(updatedMenuItem, 'menuItemId', 1);
      assert.deepPropertyVal(updatedMenuItem, 'name', 'Menu 1 Item 1 New Name');
      assert.deepPropertyVal(updatedMenuItem, 'description', 'Menu 1 Item 1 New Description');
      assert.deepPropertyVal(updatedMenuItem, 'inventory', 11);
      assert.deepPropertyVal(updatedMenuItem, 'price', 2.55);
      assert.deepPropertyVal(updatedMenuItem, 'menuId', 1);
    });

  });

  describe('#delete()', function () {

    let deleteResult;

    beforeEach('populate the Menu table', function (done) {
      seed.seedMenuDatabase(done);
    });

    beforeEach('populate the MenuItem table', function (done) {
      seed.seedMenuItemDatabase(done);
    });

    beforeEach('Get a menuItem from the database', async function () {
      menuItem = await MenuItem.get(1);
    });

    beforeEach('Delete the menuItem', async function () {
      deleteResult = await menuItem.delete();
    });

    it('deletes the menuItem from the database', function (done) {

      testDb.get(`SELECT *
      FROM MenuItem
      WHERE id = $menuItemId;`, {
        $menuItemId: menuItem.menuItemId
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
      FROM MenuItem`, function (err, rows) {
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

});

function createMenuItem() {
  return new MenuItem(menuItemTemplate);
}
