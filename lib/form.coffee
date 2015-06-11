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
		else
			throw new Error("Unsupported option type: #{option.type}")

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
