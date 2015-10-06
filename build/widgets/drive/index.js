
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
var DriveScanner, InquirerList, Promise, UI, _, async, cleanupList, driveToChoice, drivelist, getDrives;

_ = require('lodash');

async = require('async');

Promise = require('bluebird');

drivelist = Promise.promisifyAll(require('drivelist'));

InquirerList = require('inquirer/lib/prompts/list');

UI = require('inquirer/lib/ui/baseUI');

DriveScanner = require('./drive-scanner');

driveToChoice = function(drive) {
  return {
    name: drive.device + " (" + drive.size + ") - " + drive.description,
    value: drive.device
  };
};

cleanupList = function(previous, current) {
  var removedDrive;
  removedDrive = driveToChoice(current);
  return _.reject(previous, function(drive) {
    return _.isEqual(_.pick(drive, 'name', 'value'), removedDrive);
  });
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
    var list, onSubmit, options, render, scanner, ui;
    options = {
      message: message,
      name: 'drives',
      choices: _.map(drives, driveToChoice)
    };
    ui = new UI({
      input: process.stdin,
      output: process.stdout
    });
    list = new InquirerList(options, ui.rl);
    onSubmit = list.onSubmit;
    list.onSubmit = function() {
      if (list.opt.choices.length === 0) {
        return;
      }
      return onSubmit.apply(list, arguments);
    };
    render = list.render;
    list.render = function() {
      if (list.opt.choices.length === 0) {
        return list.screen.render('No available drives');
      }
      return render.apply(list, arguments);
    };
    scanner = new DriveScanner(getDrives, {
      interval: 1000,
      drives: drives
    });
    scanner.on('add', function(drive) {
      list.opt.choices.push(driveToChoice(drive));
      return list.render();
    });
    scanner.on('remove', function(drive) {
      list.opt.choices.choices = cleanupList(list.opt.choices.choices, drive);
      list.opt.choices.realChoices = cleanupList(list.opt.choices.realChoices, drive);
      return list.render();
    });
    return Promise.fromNode(function(callback) {
      return list.run(function(answers) {
        ui.close();
        return callback(null, answers);
      });
    }).tap(_.bind(scanner.stop, scanner));
  });
};
