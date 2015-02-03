_ = require('lodash')
drivelist = require('drivelist')
async = require('async')
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

		drives = _.map drives, (item) ->
			return {
				name: "#{item.device} (#{item.size}) - #{item.description}"
				value: item.device
			}

		widgets.select('Select a drive', drives, callback)
