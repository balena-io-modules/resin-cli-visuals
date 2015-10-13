
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
var DriveScanner, DynamicList, Promise, _, async, chalk, driveToChoice, drivelist, getDrives;

_ = require('lodash');

chalk = require('chalk');

async = require('async');

Promise = require('bluebird');

drivelist = Promise.promisifyAll(require('drivelist'));

DriveScanner = require('./drive-scanner');

DynamicList = require('./dynamic-list');

driveToChoice = function(drive) {
  return {
    name: drive.device + " (" + drive.size + ") - " + drive.description,
    value: drive.device
  };
};

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
 * @name drive
 * @function
 * @public
 * @memberof visuals
 *
 * @description
 * The dropdown detects and autorefreshes itself when the drive list changes.
 *
 * @param {String} [message='Select a drive'] - message
 * @returns {Promise<String>} device path
 *
 * @example
 * visuals.drive('Please select a drive').then (drive) ->
 * 	console.log(drive)
 */

module.exports = function(message) {
  if (message == null) {
    message = 'Select a drive';
  }
  return getDrives().then(function(drives) {
    var list, scanner;
    scanner = new DriveScanner(getDrives, {
      interval: 1000,
      drives: drives
    });
    list = new DynamicList({
      message: message,
      emptyMessage: (chalk.red('x')) + " No available drives, plug one!",
      choices: _.map(drives, driveToChoice)
    });
    scanner.on('add', function(drive) {
      list.addChoice(driveToChoice(drive));
      return list.render();
    });
    scanner.on('remove', function(drive) {
      list.removeChoice(driveToChoice(drive));
      return list.render();
    });
    return list.run().tap(_.bind(scanner.stop, scanner));
  });
};
