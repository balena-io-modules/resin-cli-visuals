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
moment = require('moment')
require('moment-duration-format')(moment)
ProgressBarFormatter = require('progress-bar-formatter')

CARRIAGE_RETURN = '\u001b[1A'

module.exports = class Progress

	###*
	# @summary Create a CLI Progress Bar
	# @name Progress
	# @class
	# @public
	# @memberof visuals
	#
	# @param {String} message - message
	# @param {WritableStream} stream
	# @returns {Progress} progress bar instance
	#
	# @throws Will throw if no message.
	#
	# @example
	# progress = new visuals.Progress('Hello World')
	###
	constructor: (message, stream = process.stdout) ->
		if _.str.isBlank(message)
			throw new Error('Missing message')

		@_stream = stream
		@_message = message
		@_bar = new ProgressBarFormatter
			complete: '='
			incomplete: ' '

			# Width of the progress bar
			length: 24

	###*
	# @summary Get progress string from a state
	# @name visuals.Progress#_tick
	# @method
	# @private
	#
	# @param {Object} state - progress state
	# @param {Number} state.percentage - percentage
	# @param {String} [state.message] - message
	# @param {Number} [state.eta] - eta in seconds
	#
	# @throws Will throw if no percentage.
	# @throws Will throw if no eta.
	#
	# @returns {String} progress string
	#
	#	@example
	# progress = new visuals.Progress('Hello World')
	# string = progress._tick(percentage: 49, eta: 300)
	# console.log(string)
	###
	_tick: (state) ->

		if not state.percentage?
			throw new Error('Missing percentage')

		bar = @_bar.format(state.percentage / 100)
		percentage = Math.floor(state.percentage)

		@_lastLine = "#{@_message}"
		if state.message?
			@_lastLine = "#{state.message}"
		@_lastLine += " [#{bar}] #{percentage}%"
		if state.eta?
			@_lastLine += " eta #{moment.duration(state.eta, 'seconds').format('m[m]ss[s]')}"

		return @_lastLine

	###*
	# @summary Erase last printed line
	# @name visuals.Progress#_eraseLastLine
	# @method
	# @private
	#
	# @example
	# progress = new visuals.Progress('Hello World')
	# progress._eraseLastLine()
	###
	_eraseLastLine: ->
		if not @_lastLine?
			@_stream.write('\n')
			return

		eraser = _.str.repeat(' ', @_lastLine.length)
		@_stream.write(CARRIAGE_RETURN + eraser + '\n')

	###*
	# @summary Update the progress bar
	# @name visuals.Progress#update
	# @method
	# @public
	#
	# @param {Object} state - progress state
	# @param {Number} state.percentage - percentage
	# @parm  {String} [state.message] - message
	# @param {Number} [state.eta] - eta in seconds
	#
	# @example
	# progress = new visuals.Progress('Hello World')
	# progress.update(percentage: 49, eta: 300)
	###
	update: (state) ->
		@_eraseLastLine()
		@_stream.write(CARRIAGE_RETURN + @_tick(state) + '\n')
