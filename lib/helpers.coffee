_ = require('lodash')
_.str = require('underscore.string')

exports.chop = (input, length) ->
	return _.str.chop(input, length).join('\n')
