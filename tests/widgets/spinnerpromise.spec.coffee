m = require('mochainon')
stdout = require('../utils/stdout')
SpinnerPromise = require('../../lib/widgets/spinnerpromise')
BluebirdPromise = require('bluebird')

describe 'SpinnerPromise:', ->

	describe '.constructor()', ->

		it 'should return rejected promise is not a Promise/A+ compatible promise', ->
			m.chai.expect(
				new SpinnerPromise
					promise: {}
					startMessage: 'start'
			).to.be.rejectedWith("'promise' must be a Promises/A+ compatible promise")

		it 'should return rejected promise if startMessage is an empty string', ->
			m.chai.expect(
				new SpinnerPromise
					promise: Promise.resolve(true)
			).to.be.rejectedWith('Missing spinner start message')

		it 'should return resolved native promise', ->
			m.chai.expect(
				new SpinnerPromise
					promise: Promise.resolve(true)
					startMessage: 'start'
			).to.eventually.equal(true)

		it 'should return resolved Bluebird promise', ->
			m.chai.expect(
				new SpinnerPromise
					promise: BluebirdPromise.resolve(true)
					startMessage: 'start'
			).to.eventually.equal(true)

		it 'should return rejected native promise', ->
			m.chai.expect(
				new SpinnerPromise
					promise: Promise.reject(new Error('Rejected native promise'))
					startMessage: 'start'
			).to.be.rejectedWith('Rejected native promise')

		it 'should return rejected Bluebird promise', ->
			m.chai.expect(
				new SpinnerPromise
					promise: BluebirdPromise.reject(new Error('Rejected Bluebird promise'))
					startMessage: 'start'
			).to.be.rejectedWith('Rejected Bluebird promise')
