/*
 * files.js: Instance methods for working with files from Google Cloud Storage
 *
 * (C) 2012 Charlie Robbins, Ken Perkins, Ross Kukulinski & the Contributors.
 *
 */

var pkgcloud = require('../../../../../lib/pkgcloud'),
  through = require('through2'),
  path = require('path'),
  fs = require('fs-extended'),
  storage = pkgcloud.providers.local.storage,
  _ = require('underscore');

/**
 * Destroy a file in the specified container.
 *
 * @param {string} container - Name of the container to destroy the file in.
 * @param {string} file - Name of the file to destroy.
 * @param {function} callback - Continuation to respond to when complete.
 */
exports.removeFile = function (container, file, callback) {
  var self = this;
  if (container instanceof storage.Container) {
    container = container.name;
  }

  if (file instanceof storage.File) {
    file = file.name;
  }
  var filePath = path.join(self.config.baseLocalPath, container);
  fs.deleteFile(filePath, function(err) {
    if (callback) {
      callback(err);
    }
  });
};

/**
 * Upload a file to the specified bucket.
 *
 * @param {object} options - Configuration object.
 * @param {object} options.container - Container object for the file.
 * @param {object|string} options.file - The file to upload content to.
 * @return {stream}
 */
exports.upload = function (options) {
  var self = this;
  var remote = options.file || options.remote;
  var file = remote instanceof storage.File ? remote : new storage.File(self, {container:options.container, name:remote});

  // check for deprecated calling with a callback
  if (typeof arguments[arguments.length - 1] === 'function') {
    self.emit('log::warn', 'storage.upload no longer supports calling with a callback');
  }

  var proxyStream = through();
  var writableStream = fs.createWriteStream(file.fullPath, options);

  // we need a proxy stream so we can always return a file model
  // via the 'success' event
  writableStream.on('finish', function() {
    proxyStream.emit('success', file);
  });

  writableStream.on('error', function(err) {
    proxyStream.emit('error', err);
  });

  writableStream.on('data', function(chunk) {
    proxyStream.emit('data', chunk);
  });

  proxyStream.pipe(writableStream);

  return proxyStream;
};

/**
 * Download a file from the specified bucket.
 *
 * @param {object} options - Configuration object.
 * @param {object} options.container - Container object for the file.
 * @param {object|string} options.file - The file to upload content to.
 * @return {stream}
 */
exports.download = function (options) {
  var self = this;
  var file = options.file instanceof storage.File ? options.file : new storage.File(self, {container:options.container, name:options.file});
  return fs.createReadStream(file.fullPath, options);
};

exports.getFile = function (container, file, callback) {
  var self = this;
  callback(null, new storage.File(self, {container:container, name:file}));
};

/**
 * Get all of the files from a gcloud bucket.
 *
 * @param {object} container - Container object for the file.
 * @param {object=|function} options - Options or callback.
 * @param {string} options.maxResults - Maximum amount of results to fetch.
 * @param {function} callback - Continuation to respond to when complete.
 */
exports.getFiles = function (container, options, callback) {
  var self = this;

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  else if (!options) {
    options = {};
  }

  fs.listAll(container.fullPath, _.extend({recursive:true}, options), function(err, filelist) {
    if (err) {
      callback(err, null);
      return;
    }
    filelist = filelist ? filelist : [];
    callback(null, _.map(filelist, function(file) {return new storage.File(self, {container:container, name:file})}));
  });
};
