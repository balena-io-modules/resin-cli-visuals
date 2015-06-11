_ = require('lodash')
inquirer = require('inquirer')

###*
# @summary Translate a form description to inquirer questions
# @function
# @private
#
# @param {Object[]} form - form description
# @returns {Object[]} inquirer questions
#
# @todo This is a work in progress and only necessary input types are supported.
#
# @example
# questions = visuals.form.parse [
#		label: 'Processor'
#		name: 'processorType'
#		type: 'select'
#		values: [ 'Z7010', 'Z7020' ]
#	,
#		label: 'Coprocessor cores'
#		name: 'coprocessorCore'
#		type: 'select'
#		values: [ '16', '64' ]
#	,
#		label: 'HDMI'
#		name: 'hdmi'
#		type: 'checkbox'
#		value: 1
# ]
###
exports.parse = (form) ->
	return _.map form, (option) ->
		result =
			message: option.label
			name: option.name
			validate: option.validate

		if not _.isEmpty(option.when)
			result.when = (answers) ->
				return false if not answers?
				return _.findWhere([ answers ], option.when)?

		if option.type is 'select'
			result.type = 'list'
			result.choices = option.values
		else if option.type is 'checkbox'
			result.type = 'confirm'
			result.default = !!option.value
		else if option.type is 'text'
			result.type = 'input'
			result.default = option.value
		else if option.type is 'password'
			result.type = 'password'
		else
			throw new Error("Unsupported option type: #{option.type}")

		# Delete properties containing undefined values
		for key, value of result
			delete result[key] if not value?
		return result

###*
# @summary Run a form description
# @function
# @public
#
# @param {Object[]} form - form description
# @param {Function} callback - callback (error, answers)
#
# @example
# visuals.form.run [
#		label: 'Processor'
#		name: 'processorType'
#		type: 'select'
#		values: [ 'Z7010', 'Z7020' ]
#	,
#		label: 'Coprocessor cores'
#		name: 'coprocessorCore'
#		type: 'select'
#		values: [ '16', '64' ]
#	,
#		label: 'HDMI'
#		name: 'hdmi'
#		type: 'checkbox'
#		value: 1
# ], (error, answers) ->
#		throw error if error?
#		console.log(answers)
###
exports.run = (form, callback) ->
	inquirer.prompt(exports.parse(form), _.partial(callback, null))

###*
# @summary Run a single form question
# @function
# @public
#
# @param {Object} question - form question
# @param {Function} callback - callback (error, answer)
#
# @example
# visuals.form.ask
#		label: 'Processor'
#		type: 'select'
#		values: [ 'Z7010', 'Z7020' ]
# , (error, answer) ->
#		throw error if error?
#		console.log(answer)
###
exports.ask = (question, callback) ->
	question.name ?= 'question'
	exports.run [ question ], (error, answers) ->
		return callback(error) if error?
		return callback(null, answers[question.name])
