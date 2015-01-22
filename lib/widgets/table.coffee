_ = require('lodash')
_.str = require('underscore.string')
cliff = require('cliff')

normalizeHeader = (header) ->
	header = header.toUpperCase()
	return header.replace(/_/g, ' ')

exports.vertical = (data, ordering = []) ->
	return if _.isEmpty(data)

	result = []

	for next in ordering
		normalizedHeader = normalizeHeader(next)
		result.push("#{normalizedHeader}: #{data[next]}")

	return result.join('\n')

exports.horizontal = (data, ordering) ->
	return if _.isEmpty(data)

	data = _.map data, (object) ->
		return _.pick(object, ordering)

	result = _.str.lines(cliff.stringifyObjectRows(data, ordering))
	result[0] = normalizeHeader(result[0])
	return result.join('\n')
