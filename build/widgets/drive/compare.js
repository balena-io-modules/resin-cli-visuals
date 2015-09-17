
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
var _, containsDeep, createDiffOperation, differenceDeep;

_ = require('lodash');

containsDeep = function(array, item) {
  return _.any(_.map(array, _.partial(_.isEqual, item)));
};

differenceDeep = function(x, y) {
  return _.filter(x, _.partial(_.negate(containsDeep), y));
};

createDiffOperation = function(type, element) {
  return {
    type: type,
    drive: element
  };
};


/**
 * @summary Detect changes regarding drives between different time intervals
 * @function
 * @protected
 *
 * @param {Array} - previous drive list
 * @param {Array} - current drive list
 * @returns {Object[]} - current drive list, potential differences with previous one
 *
 * @example
 * compare(previousDrives, currentDrives)
 */

module.exports = function(previous, current) {
  var additions, mappingAdditions, mappingRemovals, removals;
  additions = differenceDeep(current, previous);
  removals = differenceDeep(previous, current);
  mappingAdditions = _.map(additions, _.partial(createDiffOperation, 'add'));
  mappingRemovals = _.map(removals, _.partial(createDiffOperation, 'remove'));
  return {
    drives: current,
    diff: _.union(mappingAdditions, mappingRemovals)
  };
};
