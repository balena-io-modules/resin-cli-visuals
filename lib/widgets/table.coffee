_ = require('lodash-contrib')
_.str = require('underscore.string')
columnify = require('columnify')

normalizeHeader = (header) ->
	header = header.toUpperCase()
	return header.replace(/_/g, ' ')

normalizeTable = (table) ->
	table = table.split('\n')
	table[0] = normalizeHeader(table[0])
	return table.join('\n')

exports.vertical = (data, ordering) ->
	return if _.isEmpty(data) or _.isEmpty(ordering)

	result = []

	for next in ordering
		normalizedHeader = normalizeHeader(next)
		result.push("#{normalizedHeader}: #{data[next]}")

	return result.join('\n')

exports.horizontal = (data, ordering) ->
	return if not data? or _.isEmpty(ordering)
	table = columnify(data, columns: ordering)
	return normalizeTable(table)
