/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// This function provides a handy way to
// intercept stdout for testing purposes.
exports.intercept = function() {
	const {
        write
    } = process.stdout;

	const result =
		{data: ''};

	result.restore = function() {
		result.data = '';
		return process.stdout.write = write;
	};

	process.stdout.write = function(data) {
		result.data += data;
		return write.apply(process.stdout, arguments);
	};

	return result;
};
