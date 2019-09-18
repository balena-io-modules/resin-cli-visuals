###
Copyright 2016 Resin.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
###

_ = require('lodash')
_.str = require('underscore.string')
CliSpinner = require('cli-spinner').Spinner

module.exports = class Spinner

	###*
	# @summary Create a CLI Spinner
	# @name Spinner
	# @class
	# @public
	# @memberof visuals
	#
	# @param {WritableStream} stream
	# @param {String} message - message
	# @returns {Spinner} spinner instance
	#
	# @throws Will throw if no message.
	#
	# @example
	# spinner = new visuals.Spinner('Hello World')
	###
	constructor: (message, stream = process.stdout) ->

		# The message is not strictly necessary
		# however we require it to force clients
		# to be descriptive about the on going process
		if _.str.isBlank(message)
			throw new Error('Missing message')

		@spinner = new CliSpinner({ text: "#{message}", stream })
		@spinner.setSpinnerString('|/-\\')
		@spinner.setSpinnerDelay(60)

		@started = false

	###*
	# @summary Start the spinner
	# @name visuals.Spinner#start
	# @method
	# @public
	#
	# @example
	# spinner = new visuals.Spinner('Hello World')
	# spinner.start()
	###
	start: ->
		return if @started
		@spinner.start()
		@started = true

	###*
	# @summary Stop the spinner
	# @name visuals.Spinner#stop
	# @method
	# @public
	#
	# @example
	# spinner = new visuals.Spinner('Hello World')
	# spinner.stop()
	###
	stop: ->
		return if not @started
		@spinner.stop(true)
		@started = false
