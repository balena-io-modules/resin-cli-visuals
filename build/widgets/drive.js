
/*
The MIT License

Copyright (c) 2015 Resin.io, Inc. https://resin.io.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
var Promise, _, async, drivelist, form, getDrives;

_ = require('lodash');

async = require('async');

Promise = require('bluebird');

drivelist = Promise.promisifyAll(require('drivelist'));

form = require('resin-cli-form');

getDrives = function() {
  return drivelist.listAsync().then(function(drives) {
    return Promise.fromNode(function(callback) {
      return async.reject(drives, drivelist.isSystem, function(results) {
        return callback(null, results);
      });
    });
  });
};


/**
 * @summary Prompt the user to select a drive device
 * @name visuals.drive
 * @function
 * @public
 * @memberof visuals
 *
 * @description
 * Currently, this function only checks the drive list once. In the future, the dropdown will detect and autorefresh itself when the drive list changes.
 *
 * @returns {Promise<String>} device path
 *
 * @example
 * visuals.drive().then (drive) ->
 * 	console.log(drive)
 */

module.exports = function() {
  return getDrives().then(function(drives) {
    if (_.isEmpty(drives)) {
      throw new Error('No available drives');
    }
    return form.ask({
      type: 'list',
      name: 'drive',
      message: 'Select a drive',
      choices: _.map(drives, function(drive) {
        return {
          name: drive.device + " (" + drive.size + ") - " + drive.description,
          value: drive.device
        };
      })
    });
  });
};
