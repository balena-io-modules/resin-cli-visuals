CliSpinner = require('cli-spinner').Spinner

module.exports = class Spinner

	constructor: (message) ->

		if not message?
			throw new Error('Missing message')

		@message = "%s #{message}"

		@spinner = new CliSpinner(@message)
		@spinner.setSpinnerString('|/-\\')

	start: ->
		@spinner.start()

	stop: ->
		@spinner.stop(true)
