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

_ = require('lodash')
async = require('async')
Promise = require('bluebird')
drivelist = Promise.promisifyAll(require('drivelist'))
form = require('resin-cli-form')

getDrives = ->
	drivelist.listAsync().then (drives) ->
		Promise.fromNode (callback) ->
			async.reject drives, drivelist.isSystem, (results) ->
				return callback(null, results)

###*
# @summary Prompt the user to select a drive device
# @name visuals.drive
# @function
# @public
# @memberof visuals
#
# @description
# Currently, this function only checks the drive list once. In the future, the dropdown will detect and autorefresh itself when the drive list changes.
#
# This widget automatically prompts for confirmation, and rejects with an error message if not confirmed.
#
# @param {String} [message='Select a drive'] - message
# @returns {Promise<String>} device path
#
# @example
# visuals.drive('Please select a drive').then (drive) ->
# 	console.log(drive)
###
module.exports = (message = 'Select a drive') ->
	getDrives().then (drives) ->

		if _.isEmpty(drives)
			throw new Error('No available drives')

		form.ask
			type: 'list'
			name: 'drive'
			message: message
			choices: _.map drives, (drive) ->
				return {
					name: "#{drive.device} (#{drive.size}) - #{drive.description}"
					value: drive.device
				}

	.then (drive) ->
		form.ask
			type: 'confirm'
			default: false
			message: "This will completely erase #{drive}. Are you sure you want to continue?"
		.tap (confirmation) ->
			throw new Error('Aborted') if not confirmation
		.return(drive)
