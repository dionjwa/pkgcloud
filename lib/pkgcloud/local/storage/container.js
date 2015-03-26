/*
 * container.js: Google Cloud Storage Bucket
 *
 * (C) 2012 Charlie Robbins, Ken Perkins, Ross Kukulinski & the Contributors.
 *
 */

var util = require('util'),
  base  = require('../../core/storage/container'),
  path = require('path'),
  _ = require('underscore');

var Container = exports.Container = function Container(client, details) {
  base.Container.call(this, client, details);
};

util.inherits(Container, base.Container);

Container.prototype._setProperties = function (name) {
  this.name = name;
};

Container.prototype.toJSON = function () {
  return _.pick(this, ['name']);
};

Container.prototype.__defineGetter__('fullPath', function () {
  return path.join(this.client.config.baseLocalPath, this.name);
});
