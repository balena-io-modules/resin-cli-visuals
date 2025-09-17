import { expect } from 'chai';
import * as stdout from '../utils/stdout';
import Progress from '../../lib/widgets/progress';

describe('Progress:', function () {
	describe('.constructor()', function () {
		it('should throw if no message', () =>
			expect(() => new Progress(null)).to.throw('Missing message'));

		it('should throw if message is an empty string', () =>
			expect(() => new Progress('  ')).to.throw('Missing message'));
	});

	describe('given a progress instance', function () {
		beforeEach(function () {
			return (this.progress = new Progress('foo'));
		});

		describe('given stdout interceptors', function () {
			beforeEach(function () {
				return (this.stdout = stdout.intercept());
			});

			afterEach(function () {
				return this.stdout.restore();
			});

			describe('#update()', function () {
				it('should throw if no percentage', function () {
					expect(() => {
						return this.progress.update({ eta: 300 });
					}).to.throw('Missing percentage');
				});

				it('should hide the eta if not specified', function () {
					expect(this.stdout.data).to.equal('');
					this.progress.update({ percentage: 20 });

					const progress = '\n\u001b[1Afoo [=====                   ] 20%\n';
					expect(this.stdout.data).to.equal(progress);
				});

				it('should print a progress bar with no progress', function () {
					expect(this.stdout.data).to.equal('');
					this.progress.update({ percentage: 0, eta: 20 });

					const progress =
						'\n\u001b[1Afoo [                        ] 0% eta 20s\n';
					expect(this.stdout.data).to.equal(progress);
				});

				it('should print a progress bar with progress', function () {
					expect(this.stdout.data).to.equal('');
					this.progress.update({ percentage: 20, eta: 20 });

					const progress =
						'\n\u001b[1Afoo [=====                   ] 20% eta 20s\n';
					expect(this.stdout.data).to.equal(progress);
				});

				it('should print a progress with a long eta', function () {
					expect(this.stdout.data).to.equal('');
					this.progress.update({ percentage: 20, eta: 500 });

					const progress =
						'\n\u001b[1Afoo [=====                   ] 20% eta 8m20s\n';
					expect(this.stdout.data).to.equal(progress);
				});

				it('should print a finished progress bar', function () {
					expect(this.stdout.data).to.equal('');
					this.progress.update({ percentage: 100, eta: 0 });

					const progress =
						'\n\u001b[1Afoo [========================] 100% eta 0s\n';
					expect(this.stdout.data).to.equal(progress);
				});

				it('should erase older lines when printing continuously', function () {
					expect(this.stdout.data).to.equal('');
					this.progress.update({ percentage: 20, eta: 20 });
					this.progress.update({ percentage: 21, eta: 19 });
					this.progress.update({ percentage: 22, eta: 18 });

					const progress = [
						'\n\u001b[1Afoo [=====                   ] 20% eta 20s\n',
						'\u001b[1A                                          ',
						'\n\u001b[1Afoo [=====                   ] 21% eta 19s\n',
						'\u001b[1A                                          ',
						'\n\u001b[1Afoo [=====                   ] 22% eta 18s\n',
					].join('');

					expect(this.stdout.data).to.equal(progress);
				});

				it('should print progress bar with a new message', function () {
					expect(this.stdout.data).to.equal('');
					this.progress.update({ percentage: 20, eta: 20, message: 'bar' });

					const progress =
						'\n\u001b[1Abar [=====                   ] 20% eta 20s\n';
					expect(this.stdout.data).to.equal(progress);
				});
			});
		});
	});
});
