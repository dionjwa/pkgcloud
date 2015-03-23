/*
 * containers.js: Instance methods for working with containers from Google Cloud Storage
 *
 * (C) 2012 Charlie Robbins, Ken Perkins, Ross Kukulinski & the Contributors.
 *
 */

var pkgcloud = require('../../../../../lib/pkgcloud'),
  storage = pkgcloud.providers.local.storage,
  path = require('path'),
  fs = require('fs-extended');

function filter(itemPath, stat) {
    return stat.isDirectory();
}

/**
 * Get all Google Cloud Storage containers for this instance.
 *
 * @param {function} callback - Continuation to respond to when complete.
 */
exports.getContainers = function (callback) {
  var self = this;
  var basePath = this.config.baseLocalPath;
  fs.createDir(basePath, null, function(err) {
    if (err) {
      callback(err, []);
      return;
    }
    console.log('basePath' + basePath);
    fs.listAll(basePath, {filter: filter},
        function (err, files) {
            if (err) {
              callback(err, []);
              return;
            }
            var containers = files.map(function(container) {
              return new (storage.Container)(self, container);
            });
            callback(null, containers);
        });
  });
};

/**
 * Responds with the Google Cloud Storage bucket for the specified container.
 *
 * @param {string|storage.Container} container - The container to return.
 * @param {function} callback - Continuation to respond to when complete.
 */
exports.getContainer = function (container, callback) {
  var self = this;
  callback(null, new (storage.Container)(self, container));
};

/**
 * Creates the specified `container` in the Google Cloud Storage account
 * associated with this instance.
 *
 * @param {string|storage.Container} container - The container to create.
 * @param {function} callback - Continuation to respond to when complete.
 */
exports.createContainer = function (options, callback) {
  var self = this;
  var containerName = options instanceof storage.Container ? options.name : options;
  callback(null, new (storage.Container)(self, containerName));
};

/**
 * Destroys the specified container and all files in it.
 *
 * @param {string|storage.Container} container - The container to destroy.
 * @param {function} callback - Continuation to respond to when complete.
 */
exports.destroyContainer = function (container, callback) {
  var basePath = this.config.baseLocalPath;
  var containerName = container instanceof storage.Container ? container.name : container;
  var containerPath = path.join(basePath, containerName);
  fs.deleteDir(containerPath, function(err) {
    callback(err, err != null);
  });
};
