_ = require('lodash')
_.str = require('underscore.string')
ProgressBarFormatter = require('progress-bar-formatter')

CARRIAGE_RETURN = '\u001b[1A'

module.exports = class Progress
	constructor: (message, size) ->

		if not message?
			throw new Error('Missing message')

		@bar = new ProgressBarFormatter
			complete: '='
			incomplete: ' '
			length: size

		@format = "#{message} [<%= bar %>] <%= percentage %>% eta <%= eta %>s"

	tick: (state) ->

		if not state.percentage?
			throw new Error('Missing percentage')

		if not state.eta?
			throw new Error('Missing eta')

		@lastLine = _.template @format,
			bar: @bar.format(state.percentage / 100)
			percentage: Math.floor(state.percentage)
			eta: state.eta

		return @lastLine

	eraseLastLine: ->
		if not @lastLine?
			process.stdout.write('\n')
			return

		eraser = _.str.repeat(' ', @lastLine.length)
		console.log(CARRIAGE_RETURN + eraser)

	update: (state) ->
		@eraseLastLine()
		bar = CARRIAGE_RETURN + @tick(state)
		console.log(bar)
