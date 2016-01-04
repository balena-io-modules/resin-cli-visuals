
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
var DriveScanner, EventEmitter, _, compare,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

EventEmitter = require('events').EventEmitter;

_ = require('lodash');

compare = require('./compare');

module.exports = DriveScanner = (function(superClass) {
  extend(DriveScanner, superClass);


  /**
  	 * @summary Dynamically detect changes of connected drives
  	 * @class
  	 * @protected
  	 *
  	 * @param {Function} driveFinder - drive finder
  	 * @param {Object} [options] - scan options
  	 * @param {Number} [options.interval=1000] - interval
  	 * @param {Object[]} [options.drives] - current drives
  	 *
  	 * @example
  	 * scanner = new DriveScanner driveFinder,
  	 * 	interval: 1000
  	 * 	drives: [
  	 * 		{ foo: 'bar' }
  	 * 	]
   */

  function DriveScanner(driveFinder, options) {
    if (options == null) {
      options = {};
    }
    DriveScanner.__super__.constructor.call(this);
    _.defaults(options, {
      interval: 1000,
      drives: []
    });
    this.drives = options.drives;
    this.interval = setInterval((function(_this) {
      return function() {
        return _this.scan(driveFinder);
      };
    })(this), options.interval);
    this.scan(driveFinder);
  }


  /**
  	 * @summary Broadcast events depending on changes in drive list
  	 * @method
  	 * @private
  	 *
  	 * @param {Function} driveFinder - drive finder
  	 *
  	 * @fires DriveScanner#add
  	 * @fires DriveScanner#remove
  	 *
  	 * @example
  	 * scanner = new DriveScanner(@driveFinder, interval: 1000)
  	 * scanner.scan(driveFinder)
   */

  DriveScanner.prototype.scan = function(driveFinder) {
    return driveFinder().then((function(_this) {
      return function(drives) {
        var comparison;
        comparison = compare(_this.drives, drives);
        _this.drives = comparison.drives;
        return _.each(comparison.diff, function(operation) {
          if (operation.type === 'add') {
            return _this.emit('add', operation.drive);
          } else if (operation.type === 'remove') {
            return _this.emit('remove', operation.drive);
          } else {
            throw Error("Unknown operation: " + operation.type);
          }
        });
      };
    })(this));
  };


  /**
  	 * @summary Stop the interval
  	 * @method
  	 * @public
  	 *
  	 * @example
  	 * scanner = new DriveScanner(@driveFinder, interval: 1000)
  	 * scanner.stop()
   */

  DriveScanner.prototype.stop = function() {
    if (this.interval == null) {
      throw new Error('Can\'t stop interval. Are you calling stop() with the right context?');
    }
    return clearInterval(this.interval);
  };

  return DriveScanner;

})(EventEmitter);
