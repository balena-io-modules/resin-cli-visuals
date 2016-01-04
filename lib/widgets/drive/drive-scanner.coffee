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

EventEmitter = require('events').EventEmitter
_ = require('lodash')
compare = require('./compare')

module.exports = class DriveScanner extends EventEmitter

	###*
	# @summary Dynamically detect changes of connected drives
	# @class
	# @protected
	#
	# @param {Function} driveFinder - drive finder
	# @param {Object} [options] - scan options
	# @param {Number} [options.interval=1000] - interval
	# @param {Object[]} [options.drives] - current drives
	#
	# @example
	# scanner = new DriveScanner driveFinder,
	# 	interval: 1000
	# 	drives: [
	# 		{ foo: 'bar' }
	# 	]
	###
	constructor: (driveFinder, options = {}) ->
		super()

		_.defaults options,
			interval: 1000,
			drives: []

		@drives = options.drives

		@interval = setInterval =>
			@scan(driveFinder)
		, options.interval

		@scan(driveFinder)

	###*
	# @summary Broadcast events depending on changes in drive list
	# @method
	# @private
	#
	# @param {Function} driveFinder - drive finder
	#
	# @fires DriveScanner#add
	# @fires DriveScanner#remove
	#
	# @example
	# scanner = new DriveScanner(@driveFinder, interval: 1000)
	# scanner.scan(driveFinder)
	###
	scan: (driveFinder) ->
		driveFinder().then (drives) =>
			comparison = compare(@drives, drives)
			@drives = comparison.drives

			_.each comparison.diff, (operation) =>
				if operation.type is 'add'
					@emit('add', operation.drive)
				else if operation.type is 'remove'
					@emit('remove', operation.drive)
				else
					throw Error("Unknown operation: #{operation.type}")

	###*
	# @summary Stop the interval
	# @method
	# @public
	#
	# @example
	# scanner = new DriveScanner(@driveFinder, interval: 1000)
	# scanner.stop()
	###
	stop: ->
		if not @interval?
			throw new Error('Can\'t stop interval. Are you calling stop() with the right context?')
		clearInterval(@interval)
