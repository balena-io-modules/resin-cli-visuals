_ = require('lodash-contrib')
_.str = require('underscore.string')
cliff = require('cliff')

normalizeHeader = (header) ->
	header = header.toUpperCase()
	return header.replace(/_/g, ' ')

exports.vertical = (data, ordering) ->
	return if _.isEmpty(data) or _.isEmpty(ordering)

	result = []

	for next in ordering
		normalizedHeader = normalizeHeader(next)
		result.push("#{normalizedHeader}: #{data[next]}")

	return result.join('\n')

exports.horizontal = (data, ordering) ->
	return if not data? or _.isEmpty(ordering)

	data = _.map data, (object) ->
		return _.pick(object, ordering)

	result = _.str.lines(cliff.stringifyObjectRows(data, ordering))
	result[0] = normalizeHeader(result[0])
	result = _.map(result, _.unary(_.str.trim))

	return result.join('\n')
