/*
 * client.js: Base client from which all Google Cloud Storage clients inherit from
 *
 * (C) 2012 Charlie Robbins, Ken Perkins, Ross Kukulinski & the Contributors.
 *
 */

var util = require('util'),
  base = require('../core/base'),
  path = require('path');

var Client = exports.Client = function (options) {
  base.Client.call(this, options);

  options = options || {};

  this.provider = 'local';
  this.config.baseLocalPath = this.config.baseLocalPath || options.baseLocalPath;

};

util.inherits(Client, base.Client);

Client.prototype._getUrl = function (options) {
	if (!options.container) {
		throw "Missing container field for _getUrl";
	}
	if (!options.path) {
		throw "Missing path field for _getUrl";
	}
	return path.join(this.config.baseLocalPath, options.container, options.path);
};
