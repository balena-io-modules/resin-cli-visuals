/*
Copyright 2016 Resin.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var DriveScanner, Promise, _, chalk, driveToChoice, getDrives;

_ = require('lodash');

chalk = require('chalk');

Promise = require('bluebird');

DriveScanner = require('./drive-scanner');

driveToChoice = function(drive) {
  var size;
  size = drive.size / 1000000000;
  return {
    name: `${drive.device} (${size.toFixed(1)} GB) - ${drive.description}`,
    value: drive.device
  };
};

getDrives = function() {
  return require('drivelist').list().then(function(drives) {
    return _.reject(drives, {
      isSystem: true
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
module.exports = function(message = 'Select a drive') {
  return getDrives().then(function(drives) {
    var DynamicList, list, scanner;
    scanner = new DriveScanner(getDrives, {
      interval: 1000,
      drives: drives
    });
    DynamicList = require('inquirer-dynamic-list');
    list = new DynamicList({
      message: message,
      emptyMessage: `${chalk.red('x')} No available drives were detected, plug one in!`,
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
