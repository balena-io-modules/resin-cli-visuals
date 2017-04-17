_ = require('lodash')

# This function provides a handy way to
# intercept stdout for testing purposes.
exports.intercept = ->
	write = _.bind(process.stdout.write, process.stdout)

	result =
		data: ''

	result.restore = ->
		process.stdout.write = write
		result.data = ''

	process.stdout.write = (data) ->
		result.data += data
		write(arguments...)

	return result
