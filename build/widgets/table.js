var columnify, normalizeHeader, normalizeTable, _;

_ = require('lodash-contrib');

_.str = require('underscore.string');

columnify = require('columnify');

normalizeHeader = function(header) {
  header = header.toUpperCase();
  return header.replace(/_/g, ' ');
};

normalizeTable = function(table) {
  table = table.split('\n');
  table[0] = normalizeHeader(table[0]);
  return table.join('\n');
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
  var table;
  if ((data == null) || _.isEmpty(ordering)) {
    return;
  }
  table = columnify(data, {
    columns: ordering
  });
  return normalizeTable(table);
};
