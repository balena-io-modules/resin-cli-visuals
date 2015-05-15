_ = require('lodash')
drivelist = require('drivelist')
async = require('async')
resin = require('resin-sdk')
widgets = require('./widgets')

exports.remove = (name, confirmAttribute, deleteFunction, outerCallback) ->
	async.waterfall([

		(callback) ->
			if confirmAttribute
				return callback(null, true)

			widgets.confirmRemoval(name, callback)

		(confirmed, callback) ->
			return callback() if not confirmed
			deleteFunction(callback)

	], outerCallback)

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

			widgets.select('Select a drive', removableDrives, callback)

exports.confirm = (yesOption, message, callback) ->
	if yesOption
		return callback(null, true)
	else
		widgets.confirm(message, callback)

exports.selectNetworkParameters = (outerCallback) ->
	result = {}

	async.waterfall([

		(callback) ->
			widgets.select 'Select a network type', [ 'ethernet', 'wifi' ], (error, networkType) ->
				return callback(error) if error?
				result.network = networkType
				return callback()

		(callback) ->
			return outerCallback(null, result) if result.network isnt 'wifi'

			widgets.ask 'What\'s your wifi ssid?', null, (error, ssid) ->
				return callback(error) if error?
				result.wifiSsid = ssid
				return callback()

		(callback) ->
			widgets.ask 'What\'s your wifi key?', null, (error, key) ->
				return callback(error) if error?
				result.wifiKey = key
				return callback()

		(callback) ->
			return callback(null, result)

	], outerCallback)
