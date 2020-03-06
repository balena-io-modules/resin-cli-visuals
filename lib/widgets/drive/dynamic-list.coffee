###
The MIT License

Copyright (c) 2015 Juan Cruz Viotti, Inc. https://github.com/jviotti.

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

###*
# @module dynamiclist
###

_ = require('lodash')
Promise = require('bluebird')
InquirerList = require('inquirer/lib/prompts/list')
UI = require('inquirer/lib/ui/baseUI')

module.exports = class DynamicList extends InquirerList

	###*
	# @summary Dynamic list widget
	# @name DynamicList
	# @class
	# @public
	#
	# @param {Object} [options] - options
	# @param {Object[]} options.choices - initial choices
	# @param {String} options.message - widget message
	# @param {String} [options.emptyMessage='No options'] - message for when no choices
	#
	# @example
	# list = new DynamicList
	# 	message: 'Foo'
	# 	emptyMessage: 'Nothing to show'
	# 	choices: [
	# 		name: 'Foo'
	# 		value: 'foo'
	# 	]
	#
	# # Run the list widget
	# list.run().then (answer) ->
	# 	console.log(answer)
	#
	# # You can add new choices on the fly
	# list.addChoice
	# 	name: 'Bar'
	# 	value: 'bar'
	#
	# # We re-render to be able to see the new options
	# list.render()
	###
	constructor: (options) ->

		# Even though the name property doesn't have an actual use in the code
		# Inquirer forces us to declare it. Skipping an explicit choices
		# declaration would cause an Error during the InquirerList instantiation.
		options.name ?= 'dynamic-list'

		options.emptyMessage ?= 'No options'

		ui = new UI
			input: process.stdin
			output: process.stdout

		super(options, ui.rl)

		@options = options
		@ui = ui

	###*
	# @summary Check if the list is empty
	# @method
	# @private
	#
	# @returns {Boolean} whether is empty
	#
	# @example
	# list = new DynamicList
	# 	message: 'Foo'
	# 	emptyMessage: 'Nothing to show'
	# 	choices: [
	# 		name: 'Foo'
	# 		value: 'foo'
	# 	]
	#
	# if list.isEmpty()
	# 	console.log('The list is empty')
	###
	isEmpty: ->
		return @opt.choices.length is 0

	###*
	# @summary Event listener for when a choice is selected
	# @method
	# @private
	###
	onSubmit: ->
		return if @isEmpty()
		super(arguments...)

	###*
	# @summary Render the list
	# @method
	# @public
	#
	# @example
	# list = new DynamicList
	# 	message: 'Foo'
	# 	emptyMessage: 'Nothing to show'
	# 	choices: [
	# 		name: 'Foo'
	# 		value: 'foo'
	# 	]
	#
	# list.render()
	###
	render: ->
		if @isEmpty()

			# By using this.screen.render() the module
			# knows how many lines to clean automatically.
			return @screen.render(@options.emptyMessage)

		super(arguments...)

	###*
	# @summary Add a choice
	# @method
	# @public
	#
	# @param {Object} choice - choice
	#
	# @example
	# list = new DynamicList
	# 	message: 'Foo'
	# 	emptyMessage: 'Nothing to show'
	# 	choices: [
	# 		name: 'Foo'
	# 		value: 'foo'
	# 	]
	#
	# list.addChoice(name: 'Bar', value: 'bar')
	# list.render()
	###
	addChoice: (choice) ->

		# New data about drives are automatically being added to both
		# this.opt.choices.choices and this.opt.choices.realChoices through the
		# use of push().
		@opt.choices.push(choice)

	###*
	# @summary Remove a choice
	# @method
	# @public
	#
	# @param {Object} choice - choice
	#
	# @example
	# list = new DynamicList
	# 	message: 'Foo'
	# 	emptyMessage: 'Nothing to show'
	# 	choices: [
	# 		name: 'Foo'
	# 		value: 'foo'
	# 	]
	#
	# list.removeChoice(name: 'Foo', value: 'foo')
	# list.render()
	###
	removeChoice: (choice) ->
		cleanupList = (list, choice) ->
			return _.reject list, (item) ->
				return _.isEqual(_.pick(item, 'name', 'value'), choice)

		# `this.opt.choices` is an instance of Inquirer's Choice class.
		# This Choice class extends push with the capability of filling
		# both `.choices` and `.realChoices` as expected by the list widget,
		# however it doesn't expose a method to correctly delete a choice.
		@opt.choices.choices = cleanupList(@opt.choices.choices, choice)
		@opt.choices.realChoices = cleanupList(@opt.choices.realChoices, choice)

	###*
	# @summary Run the widget
	# @method
	# @public
	#
	# @fulfil {String} answer
	# @returns {Promise}
	#
	# @example
	# list = new DynamicList
	# 	message: 'Foo'
	# 	emptyMessage: 'Nothing to show'
	# 	choices: [
	# 		name: 'Foo'
	# 		value: 'foo'
	# 	]
	#
	# list.run().then (answer) ->
	# 	console.log(answer)
	###
	run: ->
		Promise.fromNode (callback) =>
			super (answers) =>

				# Without using explicitly the ui.close(), the process
				# won't be able to exit after returning the callback
				@ui.close()

				return callback(null, answers)
