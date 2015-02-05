_ = require('lodash')
_.str = require('underscore.string')
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

	lines: []

	tick: (state) ->

		if not state.percentage?
			throw new Error('Missing percentage')

		if not state.eta?
			throw new Error('Missing eta')

		line = _.template @format,
			bar: @bar.format(state.percentage / 100)
			percentage: Math.floor(state.percentage)
			eta: state.eta

		@lines.push(line)
		return line

	update: (state) ->
		bar = '\r' + @tick(state)
		process.stdout.write(bar)

	end: ->
		process.stdout.write('\n')
