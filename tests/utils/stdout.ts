// This function provides a handy way to
// intercept stdout for testing purposes.
export function intercept() {
	const { write } = process.stdout;

	const result = {
		data: '',
		restore: function () {
			result.data = '';
			process.stdout.write = write;
		},
	};

	process.stdout.write = function (...args) {
		const [data] = args;
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands -- it's just a test mock
		result.data += data;
		return write.apply(process.stdout, args);
	};

	return result;
}
