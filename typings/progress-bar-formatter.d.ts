declare module 'progress-bar-formatter' {
	class ProgressBarFormatter {
		constructor(opts: { complete: string; incomplete: string; length: number });
		format(percentage: number): string;
	}
	export = ProgressBarFormatter;
}
