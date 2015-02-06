var _;

_ = require('lodash');

_.str = require('underscore.string');

exports.chop = function(input, length) {
  return _.str.chop(input, length).join('\n');
};
