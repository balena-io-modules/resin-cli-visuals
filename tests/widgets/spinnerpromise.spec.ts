/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const m = require('mochainon');
const SpinnerPromise = require('../../lib/widgets/spinnerpromise');
const BluebirdPromise = require('bluebird');

describe('SpinnerPromise:', () => describe('.constructor()', function() {

    it('should return rejected promise is not a Promise/A+ compatible promise', () => m.chai.expect(
        new SpinnerPromise({
            promise: {},
            startMessage: 'start'})
    ).to.be.rejectedWith("'promise' must be a Promises/A+ compatible promise"));

    it('should return rejected promise if startMessage is an empty string', () => m.chai.expect(
        new SpinnerPromise({
            promise: Promise.resolve(true)})
    ).to.be.rejectedWith('Missing spinner start message'));

    it('should return resolved native promise', () => m.chai.expect(
        new SpinnerPromise({
            promise: Promise.resolve(true),
            startMessage: 'start'})
    ).to.eventually.equal(true));

    it('should return resolved Bluebird promise', () => m.chai.expect(
        new SpinnerPromise({
            promise: BluebirdPromise.resolve(true),
            startMessage: 'start'})
    ).to.eventually.equal(true));

    it('should return rejected native promise', () => m.chai.expect(
        new SpinnerPromise({
            promise: Promise.reject(new Error('Rejected native promise')),
            startMessage: 'start'})
    ).to.be.rejectedWith('Rejected native promise'));

    return it('should return rejected Bluebird promise', () => m.chai.expect(
        new SpinnerPromise({
            promise: BluebirdPromise.reject(new Error('Rejected Bluebird promise')),
            startMessage: 'start'})
    ).to.be.rejectedWith('Rejected Bluebird promise'));
}));
