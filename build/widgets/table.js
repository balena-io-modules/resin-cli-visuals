var cliff, tableHelpers;

cliff = require('cliff');

tableHelpers = require('./table-helpers');

exports.horizontal = function(contents, ordering, colours) {
  if (contents == null) {
    return;
  }
  contents = tableHelpers.processTableContents(contents);
  ordering = tableHelpers.normaliseOrdering(ordering, contents);
  return cliff.stringifyObjectRows(contents, ordering, colours);
};

exports.vertical = function(contents, ordering) {
  var item, next, result, _i, _j, _len, _len1;
  if (contents == null) {
    return;
  }
  contents = tableHelpers.processTableContents(contents);
  ordering = tableHelpers.normaliseOrdering(ordering, contents);
  result = [];
  for (_i = 0, _len = contents.length; _i < _len; _i++) {
    item = contents[_i];
    for (_j = 0, _len1 = ordering.length; _j < _len1; _j++) {
      next = ordering[_j];
      result.push("" + next + ": " + item[next]);
    }
  }
  return result.join('\n');
};
