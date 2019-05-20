'use strict';

/**
 * An error for when a property is set with an invalid value.
 * @extends Error
 */
exports.PropertyError = class extends Error {
  constructor(...params) {
    super(...params);
    this.name = 'PropertyError';
  }
};

/**
 * An error for when an object can not be found in the database.
 * @extends Error
 */
exports.ExistenceError = class extends Error {
  constructor(...params) {
    super(...params);
    this.name = 'ExistenceError';
  }
};
