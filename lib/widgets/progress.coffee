_ = require('lodash')
ProgressBarFormatter = require('progress-bar-formatter')

module.exports = class Progress
	constructor: (message, size) ->

		if not message?
			throw new Error('Missing message')

		@bar = new ProgressBarFormatter
			complete: '='
			incomplete: ' '
			length: size

		@format = "#{message} [<%= bar %>] <%= percentage %>% eta <%= eta %>s"

	tick: (percentage, eta) ->

		if not percentage?
			throw new Error('Missing percentage')

		if not eta?
			throw new Error('Missing eta')

		return _.template @format,
			bar: @bar.format(percentage / 100)
			percentage: Math.floor(percentage)
			eta: eta
