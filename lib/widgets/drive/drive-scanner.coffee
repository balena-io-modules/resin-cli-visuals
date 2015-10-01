###
The MIT License

Copyright (c) 2015 Resin.io, Inc. https://resin.io.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
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
