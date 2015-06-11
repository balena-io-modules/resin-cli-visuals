_ = require('lodash')
drivelist = require('drivelist')
async = require('async')
resin = require('resin-sdk')
inquirer = require('inquirer')

exports.register = (callback) ->
	inquirer.prompt([
		{
			type: 'input'
			name: 'email'
			message: 'Email'
		}
		{
			type: 'input'
			name: 'username'
			message: 'Username'
		}
		{
			type: 'password'
			name: 'password'
			message: 'Password'
			validate: (input) ->
				if input.length < 8
					return 'Password should be 8 characters long'

				return true
		}
	], _.partial(callback, null))

exports.login = (callback) ->
	inquirer.prompt([
		{
			type: 'input'
			name: 'username'
			message: 'Username'
		}
		{
			type: 'password'
			name: 'password'
			message: 'Password'
		}
	], _.partial(callback, null))

exports.remove = (name, confirmAttribute, deleteFunction, outerCallback) ->
	async.waterfall([

		(callback) ->
			if confirmAttribute
				return callback(null, true)

			inquirer.prompt [
				{
					type: 'confirm'
					name: 'confirmed'
					message: "Are you sure you want to delete the #{name}?"
					default: false
				}
			], (response) ->
				return callback(null, response.confirmed)

		(confirmed, callback) ->
			return callback() if not confirmed
			deleteFunction(callback)

	], outerCallback)

select = (message, list, callback) ->
	inquirer.prompt [
		{
			type: 'list'
			name: 'option'
			message: message or 'Select an option'
			choices: list
		}
	], (response) ->
		return callback(null, response.option)

exports.selectDrive = (callback) ->
	drivelist.list (error, drives) ->
		return callback(error) if error?

		async.reject drives, drivelist.isSystem, (removableDrives) ->

			if _.isEmpty(removableDrives)
				return callback(new Error('No available drives'))

			removableDrives = _.map removableDrives, (item) ->
				return {
					name: "#{item.device} (#{item.size}) - #{item.description}"
					value: item.device
				}

			select('Select a drive', removableDrives, callback)

exports.confirm = (yesOption, message, callback) ->
	if yesOption
		return callback(null, true)
	else
		inquirer.prompt [
			{
				type: 'confirm'
				name: 'confirmed'
				message: message
				default: false
			}
		], (response) ->
			return callback(null, response.confirmed)

ask = (message, callback) ->
	inquirer.prompt [
		{
			type: 'input'
			name: 'answer'
			message: message
			validate: (input) ->
				return _.isString(input) and not _.isEmpty(input)
		}
	], (response) ->
		return callback(null, response.answer)

exports.selectNetworkParameters = (outerCallback) ->
	result = {}

	async.waterfall([

		(callback) ->
			select 'Select a network type', [ 'ethernet', 'wifi' ], (error, networkType) ->
				return callback(error) if error?
				result.network = networkType
				return callback()

		(callback) ->
			return outerCallback(null, result) if result.network isnt 'wifi'

			ask 'What\'s your wifi ssid?', (error, ssid) ->
				return callback(error) if error?
				result.wifiSsid = ssid
				return callback()

		(callback) ->
			ask 'What\'s your wifi key?', (error, key) ->
				return callback(error) if error?
				result.wifiKey = key
				return callback()

		(callback) ->
			return callback(null, result)

	], outerCallback)

exports.selectDeviceType = (callback) ->
	resin.models.device.getSupportedDeviceTypes (error, deviceTypes) ->
		return callback(error) if error?
		select('Select a type', deviceTypes, callback)

exports.loginWithToken = (callback) ->
	ask('What\'s your token? (visible in the preferences page)', callback)
