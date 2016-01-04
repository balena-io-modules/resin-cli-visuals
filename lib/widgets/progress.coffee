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
require('moment-duration-format')
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
	# @returns {Progress} progress bar instance
	#
	# @throws Will throw if no message.
	#
	# @example
	# progress = new visuals.Progress('Hello World')
	###
	constructor: (message) ->

		if _.str.isBlank(message)
			throw new Error('Missing message')

		@_bar = new ProgressBarFormatter
			complete: '='
			incomplete: ' '

			# Width of the progress bar
			length: 24

		@_format = "#{message} [<%= bar %>] <%= percentage %>% eta <%= eta %>"

	###*
	# @summary Get progress string from a state
	# @name visuals.Progress#_tick
	# @method
	# @private
	#
	# @param {Object} state - progress state
	# @param {Number} state.percentage - percentage
	# @param {Number} state.eta - eta in seconds
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

		data =
			bar: @_bar.format(state.percentage / 100)
			percentage: Math.floor(state.percentage)
			eta: moment.duration(state.eta or 0, 'seconds').format('m[m]ss[s]')

		@_lastLine = _.template(@_format)(data)

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
			process.stdout.write('\n')
			return

		eraser = _.str.repeat(' ', @_lastLine.length)
		console.log(CARRIAGE_RETURN + eraser)

	###*
	# @summary Update the progress bar
	# @name visuals.Progress#update
	# @method
	# @public
	#
	# @param {Object} state - progress state
	# @param {Number} state.percentage - percentage
	# @param {Number} state.eta - eta in seconds
	#
	# @example
	# progress = new visuals.Progress('Hello World')
	# progress.update(percentage: 49, eta: 300)
	###
	update: (state) ->
		@_eraseLastLine()
		console.log(CARRIAGE_RETURN + @_tick(state))
