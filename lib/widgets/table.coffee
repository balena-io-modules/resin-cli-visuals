###
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
###

_ = require('lodash')
_.str = require('underscore.string')
columnify = require('columnify')

###*
# @namespace table
# @memberof visuals
###

parseOrdering = (ordering, data) ->
	return _.compact _.map ordering, (column) ->
		if _.str.isBlank(column)
			return {
				type: 'separator'
			}

		subtitleMatches = column.match(/^\$(.+)\$$/)

		if subtitleMatches?
			return {
				type: 'subtitle'
				value: subtitleMatches[1]
			}

		aliasMatches = column.match(/^(.+) => (.+)$/)

		result =
			type: 'column'
			name: aliasMatches?[1] or column
			alias: aliasMatches?[2] or column

		result.value = data[result.name]

		return result

getAlias = (ordering, column) ->
	return _.result(_.findWhere(ordering, name: column), 'alias')

normalizeTitle = (title) ->
	return _.str.underscored(title).toUpperCase().replace(/_/g, ' ')

normalizeSubtitle = (subtitle, width) ->
	return _.str.rpad("== #{normalizeTitle(subtitle)}", width, ' ')

applySubtitles = (table, ordering) ->
	splitTable = _.str.lines(table)

	titleizedTable = _.map splitTable, (row) ->
		return row if not _.str.startsWith(row, '$X$')
		rowWidth = row.length
		rowIndex = _.indexOf(splitTable, row)
		return normalizeSubtitle(ordering[rowIndex].value, rowWidth)

	return titleizedTable.join('\n')

###*
# @summary Make an horizontal table
# @name visuals.table.horizontal
# @function
# @public
#
# @description
# Notice that you can rename columns by using the CURRENT => NEW syntax in the ordering configuration.
#
# @param {Object[]} data - table data
# @param {String[]} ordering - display ordering
#
# @example
# console.log visuals.table.horizontal [
# 	{ name: 'John Doe', age: 40 }
# 	{ name: 'Jane Doe', age: 35 }
# ], [
# 	'name => full name'
# 	'age'
# ]
#
# FULL NAME AGE
# John Doe  40
# Jane Doe  35
###
exports.horizontal = (data, ordering) ->
	return if not data?

	ordering = parseOrdering(ordering, data)

	return columnify data,
		columns: _.pluck(ordering, 'name')
		preserveNewLines: true
		headingTransform: (heading) ->
			return normalizeTitle(getAlias(ordering, heading) or heading)

###*
# @summary Make a vertical table
# @name visuals.table.vertical
# @function
# @public
#
# @description
# Notice that you can rename columns by using the CURRENT => NEW syntax in the ordering configuration.
#
# Vertical tables also accept separators and subtitles, which are represented in the ordering configuration as empty strings and strings surrounded by dollar signs respectively.
#
# @param {Object} data - table data
# @param {String[]} ordering - display ordering
#
# @example
# console.log visuals.table.vertical
# 	name: 'John Doe'
# 	age: 40
# 	job: 'Developer'
# , [
# 	'$summary$'
# 	'name => full name'
# 	'age'
# 	''
# 	'$extras$'
# 	'job'
# ]
#
# == SUMMARY
# FULL NAME: John Doe
# AGE:       40
#
# == EXTRAS
# JOB:       Developer
###
exports.vertical = (data, ordering) ->
	ordering ?= _.keys(data)
	ordering = parseOrdering(ordering, data)
	ordering = _.filter ordering, (column) ->
		return column.type isnt 'column' or column.value?

	orderedData = _.map ordering, (column, index) ->
		if column.type is 'separator'
			return {
				property: null
				value: null
			}
		else if column.type is 'subtitle'
			return {

				# We use $X$ to mark titles to be able to replace them later
				# since including it here as property will result in the title
				# expanding the column if it's larger than the other properties.
				# Using $X$ is efficient since there cannot be a case where
				# other property is surrounded by dollar signs at this point
				# since it would have been considered a title.
				# We also use an index after the token to be able to identify
				# it more easily.
				property: "$X$#{index}"

				value: null
			}

		return {
			property: normalizeTitle(column.alias) + ':'
			value: column.value
		}

	table = columnify orderedData,
		showHeaders: false
		columns: [ 'property', 'value' ]
		preserveNewLines: true

	return applySubtitles(table, ordering)
