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
