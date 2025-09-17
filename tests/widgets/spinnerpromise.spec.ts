import { expect, use as chaiUse } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chaiUse(chaiAsPromised);
import SpinnerPromise from '../../lib/widgets/spinnerpromise';
import BluebirdPromise from 'bluebird';

describe('SpinnerPromise:', () =>
	describe('.constructor()', function () {
		it('should return rejected promise is not a Promise/A+ compatible promise', () =>
			expect(
				new SpinnerPromise({
					// @ts-expect-error testing invalid parameters
					promise: {},
					startMessage: 'start',
				}),
			).to.be.rejectedWith(
				"'promise' must be a Promises/A+ compatible promise",
			));

		it('should return rejected promise if startMessage is an empty string', () =>
			expect(
				// @ts-expect-error testing missing parameters
				new SpinnerPromise({
					promise: Promise.resolve(true),
				}),
			).to.be.rejectedWith('Missing spinner start message'));

		it('should return resolved native promise', () =>
			expect(
				new SpinnerPromise({
					promise: Promise.resolve(true),
					startMessage: 'start',
				}),
			).to.eventually.equal(true));

		it('should return resolved Bluebird promise', () =>
			expect(
				new SpinnerPromise({
					promise: BluebirdPromise.resolve(true),
					startMessage: 'start',
				}),
			).to.eventually.equal(true));

		it('should return rejected native promise', () =>
			expect(
				new SpinnerPromise({
					promise: Promise.reject(new Error('Rejected native promise')),
					startMessage: 'start',
				}),
			).to.be.rejectedWith('Rejected native promise'));

		it('should return rejected Bluebird promise', () =>
			expect(
				new SpinnerPromise({
					promise: BluebirdPromise.reject(
						new Error('Rejected Bluebird promise'),
					),
					startMessage: 'start',
				}),
			).to.be.rejectedWith('Rejected Bluebird promise'));
	}));
