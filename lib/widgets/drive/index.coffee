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
InquirerList = require('inquirer/lib/prompts/list')
UI = require('inquirer/lib/ui/baseUI')
DriveScanner = require('./drive-scanner')

driveToChoice = (drive) ->
	return {
		name: "#{drive.device} (#{drive.size}) - #{drive.description}"
		value: drive.device
	}

cleanupList = (previous, current) ->
	removedDrive = driveToChoice(current)

	return _.reject previous, (drive) ->

		# The reason we use _.pick and pass a custom object in _.isEqual is due to
		# the fact the initial objects (previous, current) originate from different
		# prototypes i.e. previous from Inquirer's Choice class and
		# current/removedDrive from the results provided by drivelist. This makes
		# a direct deep comparison between them impossible due the different
		# properties that they contain.
		return _.isEqual(_.pick(drive, 'name', 'value'), removedDrive)

getDrives = ->
	drivelist.listAsync().then (drives) ->
		Promise.fromNode (callback) ->
			async.reject drives, drivelist.isSystem, (results) ->
				return callback(null, results)

###*
# @summary Prompt the user to select a drive device
# @name drive
# @function
# @public
# @memberof visuals
#
# @description
# The dropdown detects and autorefreshes itself when the drive list changes.
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
		options =
			message: message

			# Even though the name property doesn't have an actual use in the code
			# Inquirer forces us to declare it. Skipping an explicit choices
			# declaration would cause an Error during the InquirerList instantiation.
			name: 'drives'

			choices: _.map(drives, driveToChoice)

		ui = new UI
			input: process.stdin
			output: process.stdout

		list = new InquirerList(options, ui.rl)

		render = list.render
		list.render = ->
			if list.opt.choices.length is 0

				# By using this.screen.render() the module
				# knows how many lines to clean automatically.
				return list.screen.render('No available drives')

			render.apply(list, arguments)

		scanner = new DriveScanner getDrives,
			interval: 1000
			drives: drives

		scanner.on 'add', (drive) ->

			# New data about drives are automatically being added to both
			# list.opt.choices.choices and list.opt.choices.realChoices through the
			# use of push().
			list.opt.choices.push(driveToChoice(drive))

			list.render()

		scanner.on 'remove', (drive) ->

			# `list.opt.choices` is an instance of Inquirer's Choice class.
			# This Choice class extends push with the capability of filling
			# both `.choices` and `.realChoices` as expected by the list widget,
			# however it doesn't expose a method to correctly delete a choice.
			list.opt.choices.choices = cleanupList(list.opt.choices.choices, drive)
			list.opt.choices.realChoices = cleanupList(list.opt.choices.realChoices, drive)

			list.render()

		Promise.fromNode (callback) ->
			list.run (answers) ->

				# Without using explicitly the ui.close(), the process
				# won't be able to exit after returning the callback
				ui.close()

				return callback(null, answers)
		.tap(_.bind(scanner.stop, scanner))
