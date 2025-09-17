import { expect } from 'chai';
import * as sinon from 'sinon';
import * as stdout from '../utils/stdout';
// eslint-disable-next-line @typescript-eslint/no-require-imports -- will replace after the major that changes the package to use exports
const Spinner = require('../../lib/widgets/spinner');

describe('Spinner:', function () {
	describe('.constructor()', function () {
		it('should throw if no message', () =>
			expect(() => new Spinner(null)).to.throw('Missing message'));

		it('should throw if message is an empty string', () =>
			expect(() => new Spinner('  ')).to.throw('Missing message'));
	});

	describe('given a spinner instance', function () {
		beforeEach(function () {
			return (this.spinner = new Spinner('foo'));
		});

		describe('given stdout interceptors', function () {
			beforeEach(function () {
				return (this.stdout = stdout.intercept());
			});

			afterEach(function () {
				return this.stdout.restore();
			});

			describe('#start()', () =>
				it('should print the spinner', function () {
					const clock = sinon.useFakeTimers();
					expect(this.stdout.data).to.equal('');

					this.spinner.start();
					clock.tick(60 * 3);

					expect(this.stdout.data).to.equal(
						[
							'\u001b[2K\u001b[1G| foo',
							'\u001b[2K\u001b[1G/ foo',
							'\u001b[2K\u001b[1G- foo',
							'\u001b[2K\u001b[1G\\ foo',
						].join(''),
					);

					clock.restore();
					return this.spinner.stop();
				}));

			describe('#stop()', () =>
				it('should stop the spinner', function () {
					const clock = sinon.useFakeTimers();
					expect(this.stdout.data).to.equal('');

					this.spinner.start();
					clock.tick(60 * 4);
					this.spinner.stop();

					expect(this.stdout.data).to.not.equal('');
					const { data } = this.stdout;
					clock.tick(60 * 4);
					expect(this.stdout.data).to.equal(data);
					clock.restore();
				}));
		});
	});
});
