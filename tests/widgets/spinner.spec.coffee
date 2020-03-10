m = require('mochainon')
stdout = require('../utils/stdout')
Spinner = require('../../lib/widgets/spinner')

describe 'Spinner:', ->

	describe '.constructor()', ->

		it 'should throw if no message', ->
			m.chai.expect ->
				new Spinner(null)
			.to.throw('Missing message')

		it 'should throw if message is an empty string', ->
			m.chai.expect ->
				new Spinner('  ')
			.to.throw('Missing message')

	describe 'given a spinner instance', ->

		beforeEach ->
			@spinner = new Spinner('foo')

		describe 'given stdout interceptors', ->

			beforeEach ->
				@stdout = stdout.intercept()

			afterEach ->
				@stdout.restore()

			describe '#start()', ->

				it 'should print the spinner', ->
					clock = m.sinon.useFakeTimers()
					m.chai.expect(@stdout.data).to.equal('')

					@spinner.start()
					clock.tick(60 * 3)

					m.chai.expect(@stdout.data).to.equal [
						'\u001b[2K\u001b[1G| foo'
						'\u001b[2K\u001b[1G/ foo'
						'\u001b[2K\u001b[1G- foo'
						'\u001b[2K\u001b[1G\\ foo'
					].join('')

					clock.restore()
					@spinner.stop()

			describe '#stop()', ->

				it 'should stop the spinner', ->
					clock = m.sinon.useFakeTimers()
					m.chai.expect(@stdout.data).to.equal('')

					@spinner.start()
					clock.tick(60 * 4)
					@spinner.stop()

					m.chai.expect(@stdout.data).to.not.equal('')
					data = @stdout.data
					clock.tick(60 * 4)
					m.chai.expect(@stdout.data).to.equal(data)
					clock.restore()
