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
		return if not @lastLine?
		eraser = _.str.repeat(' ', @lastLine.length)
		process.stdout.write("\r#{eraser}")

	update: (state) ->
		@eraseLastLine()
		bar = '\r' + @tick(state)
		process.stdout.write(bar)

	end: ->
		process.stdout.write('\n')
