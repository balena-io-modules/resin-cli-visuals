
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
var _, applySubtitles, columnify, getAlias, normalizeSubtitle, normalizeTitle, parseOrdering, trimRight;

_ = require('lodash');

_.str = require('underscore.string');

columnify = require('columnify');


/**
 * @namespace table
 * @memberof visuals
 */

parseOrdering = function(ordering, data) {
  return _.compact(_.map(ordering, function(column) {
    var aliasMatches, result, subtitleMatches;
    if (_.str.isBlank(column)) {
      return {
        type: 'separator'
      };
    }
    subtitleMatches = column.match(/^\$(.+)\$$/);
    if (subtitleMatches != null) {
      return {
        type: 'subtitle',
        value: subtitleMatches[1]
      };
    }
    aliasMatches = column.match(/^(.+) => (.+)$/);
    result = {
      type: 'column',
      name: (aliasMatches != null ? aliasMatches[1] : void 0) || column,
      alias: (aliasMatches != null ? aliasMatches[2] : void 0) || column
    };
    result.value = data[result.name];
    return result;
  }));
};

getAlias = function(ordering, column) {
  return _.result(_.findWhere(ordering, {
    name: column
  }), 'alias');
};

normalizeTitle = function(title) {
  return _.str.underscored(title).toUpperCase().replace(/_/g, ' ');
};

normalizeSubtitle = function(subtitle, width) {
  return _.str.rpad("== " + (normalizeTitle(subtitle)), width, ' ');
};

applySubtitles = function(table, ordering) {
  var splitTable, titleizedTable;
  splitTable = _.str.lines(table);
  titleizedTable = _.map(splitTable, function(row) {
    var rowIndex, rowWidth;
    if (!_.str.startsWith(row, '$X$')) {
      return row;
    }
    rowWidth = row.length;
    rowIndex = _.indexOf(splitTable, row);
    return normalizeSubtitle(ordering[rowIndex].value, rowWidth);
  });
  return titleizedTable.join('\n');
};

trimRight = function(table) {
  var splitTable;
  splitTable = _.str.lines(table);
  splitTable = _.map(splitTable, function(row) {
    return _.str.rtrim(row);
  });
  return splitTable.join('\n');
};


/**
 * @summary Make an horizontal table
 * @name visuals.table.horizontal
 * @function
 * @public
 *
 * @description
 * Notice that you can rename columns by using the CURRENT => NEW syntax in the ordering configuration.
 *
 * @param {Object[]} data - table data
 * @param {String[]} ordering - display ordering
 *
 * @example
 * console.log visuals.table.horizontal [
 * 	{ name: 'John Doe', age: 40 }
 * 	{ name: 'Jane Doe', age: 35 }
 * ], [
 * 	'name => full name'
 * 	'age'
 * ]
 *
 * FULL NAME AGE
 * John Doe  40
 * Jane Doe  35
 */

exports.horizontal = function(data, ordering) {
  if (data == null) {
    return;
  }
  ordering = parseOrdering(ordering, data);
  return trimRight(columnify(data, {
    columns: _.pluck(ordering, 'name'),
    preserveNewLines: true,
    headingTransform: function(heading) {
      return normalizeTitle(getAlias(ordering, heading) || heading);
    }
  }));
};


/**
 * @summary Make a vertical table
 * @name visuals.table.vertical
 * @function
 * @public
 *
 * @description
 * Notice that you can rename columns by using the CURRENT => NEW syntax in the ordering configuration.
 *
 * Vertical tables also accept separators and subtitles, which are represented in the ordering configuration as empty strings and strings surrounded by dollar signs respectively.
 *
 * @param {Object} data - table data
 * @param {String[]} ordering - display ordering
 *
 * @example
 * console.log visuals.table.vertical
 * 	name: 'John Doe'
 * 	age: 40
 * 	job: 'Developer'
 * , [
 * 	'$summary$'
 * 	'name => full name'
 * 	'age'
 * 	''
 * 	'$extras$'
 * 	'job'
 * ]
 *
 * == SUMMARY
 * FULL NAME: John Doe
 * AGE:       40
 *
 * == EXTRAS
 * JOB:       Developer
 */

exports.vertical = function(data, ordering) {
  var orderedData, table;
  if (ordering == null) {
    ordering = _.keys(data);
  }
  ordering = parseOrdering(ordering, data);
  ordering = _.filter(ordering, function(column) {
    return column.type !== 'column' || (column.value != null);
  });
  orderedData = _.map(ordering, function(column, index) {
    if (column.type === 'separator') {
      return {
        property: null,
        value: null
      };
    } else if (column.type === 'subtitle') {
      return {
        property: "$X$" + index,
        value: null
      };
    }
    return {
      property: normalizeTitle(column.alias) + ':',
      value: column.value
    };
  });
  table = columnify(orderedData, {
    showHeaders: false,
    columns: ['property', 'value'],
    preserveNewLines: true
  });
  return trimRight(applySubtitles(table, ordering));
};
