var cliff, normalizeHeader, _;

_ = require('lodash-contrib');

_.str = require('underscore.string');

cliff = require('cliff');

normalizeHeader = function(header) {
  header = header.toUpperCase();
  return header.replace(/_/g, ' ');
};

exports.vertical = function(data, ordering) {
  var next, normalizedHeader, result, _i, _len;
  if (_.isEmpty(data) || _.isEmpty(ordering)) {
    return;
  }
  result = [];
  for (_i = 0, _len = ordering.length; _i < _len; _i++) {
    next = ordering[_i];
    normalizedHeader = normalizeHeader(next);
    result.push("" + normalizedHeader + ": " + data[next]);
  }
  return result.join('\n');
};

exports.horizontal = function(data, ordering) {
  var result;
  if ((data == null) || _.isEmpty(ordering)) {
    return;
  }
  data = _.map(data, function(object) {
    return _.pick(object, ordering);
  });
  result = _.str.lines(cliff.stringifyObjectRows(data, ordering));
  result[0] = normalizeHeader(result[0]);
  result = _.map(result, _.unary(_.str.trim));
  return result.join('\n');
};
