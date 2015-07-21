# This function provides a handy way to
# intercept stdout for testing purposes.
exports.intercept = ->
	write = process.stdout.write

	result =
		data: ''

	result.restore = ->
		result.data = ''
		process.stdout.write = write

	process.stdout.write = (data) ->
		result.data += data
		write.apply(process.stdout, arguments)

	return result
