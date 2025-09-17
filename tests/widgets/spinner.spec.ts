/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const m = require('mochainon');
const stdout = require('../utils/stdout');
const Spinner = require('../../lib/widgets/spinner');

describe('Spinner:', function() {

	describe('.constructor()', function() {

		it('should throw if no message', () => m.chai.expect(() => new Spinner(null)).to.throw('Missing message'));

		return it('should throw if message is an empty string', () => m.chai.expect(() => new Spinner('  ')).to.throw('Missing message'));
	});

	return describe('given a spinner instance', function() {

		beforeEach(function() {
			return this.spinner = new Spinner('foo');
		});

		return describe('given stdout interceptors', function() {

			beforeEach(function() {
				return this.stdout = stdout.intercept();
			});

			afterEach(function() {
				return this.stdout.restore();
			});

			describe('#start()', () => it('should print the spinner', function() {
                const clock = m.sinon.useFakeTimers();
                m.chai.expect(this.stdout.data).to.equal('');

                this.spinner.start();
                clock.tick(60 * 3);

                m.chai.expect(this.stdout.data).to.equal([
                    '\u001b[2K\u001b[1G| foo',
                    '\u001b[2K\u001b[1G/ foo',
                    '\u001b[2K\u001b[1G- foo',
                    '\u001b[2K\u001b[1G\\ foo'
                ].join('')
                );

                clock.restore();
                return this.spinner.stop();
            }));

			return describe('#stop()', () => it('should stop the spinner', function() {
                const clock = m.sinon.useFakeTimers();
                m.chai.expect(this.stdout.data).to.equal('');

                this.spinner.start();
                clock.tick(60 * 4);
                this.spinner.stop();

                m.chai.expect(this.stdout.data).to.not.equal('');
                const {
                    data
                } = this.stdout;
                clock.tick(60 * 4);
                m.chai.expect(this.stdout.data).to.equal(data);
                return clock.restore();
            }));
		});
	});
});
