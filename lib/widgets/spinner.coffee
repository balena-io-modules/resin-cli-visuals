CliSpinner = require('cli-spinner').Spinner

module.exports = class Spinner

	constructor: (message) ->

		if not message?
			throw new Error('Missing message')

		@message = "%s #{message}"

		@spinner = new CliSpinner(@message)
		@spinner.setSpinnerString('|/-\\')

		@running = false

	isRunning: ->
		return @running

	start: ->
		return if @isRunning()
		@spinner.start()
		@running = true

	stop: ->
		return if not @isRunning()
		@spinner.stop(true)
		@running = false
