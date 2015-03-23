/*
 * client.js: Storage client for Google Cloud Storage
 *
 * (C) 2011 Charlie Robbins, Ken Perkins, Ross Kukulinski & the Contributors.
 *
 */

var util = require('util'),
  local = require('../../client'),
  _ = require('underscore'),
  pkgcloud = require('../../../../../lib/pkgcloud');

var Client = exports.Client = function (options) {
  local.Client.call(this, options);

  _.extend(this, require('./containers'));
  _.extend(this, require('./files'));
};

util.inherits(Client, local.Client);
