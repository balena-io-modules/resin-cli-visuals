os = require('os')
_ = require('lodash')
htmlToText = require('html-to-text')

###*
# @summary Convert an HTML array into plain text
# @function
# @private
###
htmlToPlainText = (instructions) ->
	return htmlToText.fromString(instructions.join('\n'))

###*
# @summary Get initialization instructions from a device manifest
# @function
# @public
#
# @description
# It returns an empty string if there are no instructions for your platform.
#
# @param {Object} manifest - device manifest
# @returns {String} device instructions
#
# @example
# resin = require('resin-sdk')
#
# resin.models.device.getManifestBySlug 'raspberry-pi', (error, manifest) ->
#		throw error if error?
#		instructions = visuals.manifest.parseInstructions(manifest.instructions)
#		console.log(instructions)
###
exports.parseInstructions = (instructions) ->
	return '' if not instructions?

	if _.isArray(instructions)
		return htmlToPlainText(instructions)

	platformHash =
		darwin: 'osx'
		linux: 'linux'
		win32: 'windows'

	platform = platformHash[os.platform()]
	osSpecificInstructions = instructions[platform]
	return '' if not osSpecificInstructions?

	return htmlToPlainText(osSpecificInstructions)
