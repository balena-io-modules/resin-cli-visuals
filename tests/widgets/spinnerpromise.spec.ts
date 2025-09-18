import { expect, use as chaiUse } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chaiUse(chaiAsPromised);
import { createSpinnerPromise } from '../../lib/widgets/spinnerpromise';

describe('SpinnerPromise:', () =>
	describe('.constructor()', function () {
		it('should return rejected promise is not a Promise/A+ compatible promise', () =>
			expect(
				createSpinnerPromise({
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
				createSpinnerPromise({
					promise: Promise.resolve(true),
				}),
			).to.be.rejectedWith('Missing spinner start message'));

		it('should return resolved native promise', () =>
			expect(
				createSpinnerPromise({
					promise: Promise.resolve(true),
					startMessage: 'start',
				}),
			).to.eventually.equal(true));

		it('should return rejected native promise', () =>
			expect(
				createSpinnerPromise({
					promise: Promise.reject(new Error('Rejected native promise')),
					startMessage: 'start',
				}),
			).to.be.rejectedWith('Rejected native promise'));
	}));
