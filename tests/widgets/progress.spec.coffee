m = require('mochainon')
stdout = require('../utils/stdout')
Progress = require('../../lib/widgets/progress')

describe 'Progress:', ->

	describe '.constructor()', ->

		it 'should throw if no message', ->
			m.chai.expect ->
				new Progress(null)
			.to.throw('Missing message')

		it 'should throw if message is an empty string', ->
			m.chai.expect ->
				new Progress('  ')
			.to.throw('Missing message')

	describe 'given a progress instance', ->

		beforeEach ->
			@progress = new Progress('foo')

		describe 'given stdout interceptors', ->

			beforeEach ->
				@stdout = stdout.intercept()

			afterEach ->
				@stdout.restore()

			describe '#update()', ->

				it 'should throw if no percentage', ->
					m.chai.expect =>
						@progress.update(eta: 300)
					.to.throw('Missing percentage')

				it 'should hide the eta if not specified', ->
					m.chai.expect(@stdout.data).to.equal('')
					@progress.update(percentage: 20)

					progress = '\n\u001b[1Afoo [=====                   ] 20%\n'
					m.chai.expect(@stdout.data).to.equal(progress)

				it 'should print a progress bar with no progress', ->
					m.chai.expect(@stdout.data).to.equal('')
					@progress.update(percentage: 0, eta: 20)

					progress = '\n\u001b[1Afoo [                        ] 0% eta 20s\n'
					m.chai.expect(@stdout.data).to.equal(progress)

				it 'should print a progress bar with progress', ->
					m.chai.expect(@stdout.data).to.equal('')
					@progress.update(percentage: 20, eta: 20)

					progress = '\n\u001b[1Afoo [=====                   ] 20% eta 20s\n'
					m.chai.expect(@stdout.data).to.equal(progress)

				it 'should print a progress with a long eta', ->
					m.chai.expect(@stdout.data).to.equal('')
					@progress.update(percentage: 20, eta: 500)

					progress = '\n\u001b[1Afoo [=====                   ] 20% eta 8m20s\n'
					m.chai.expect(@stdout.data).to.equal(progress)

				it 'should print a finished progress bar', ->
					m.chai.expect(@stdout.data).to.equal('')
					@progress.update(percentage: 100, eta: 0)

					progress = '\n\u001b[1Afoo [========================] 100% eta 0s\n'
					m.chai.expect(@stdout.data).to.equal(progress)

				it 'should erase older lines when printing continuously', ->
					m.chai.expect(@stdout.data).to.equal('')
					@progress.update(percentage: 20, eta: 20)
					@progress.update(percentage: 21, eta: 19)
					@progress.update(percentage: 22, eta: 18)

					progress = [
						'\n\u001b[1Afoo [=====                   ] 20% eta 20s\n'
					  	'\u001b[1A                                          '
						'\n\u001b[1Afoo [=====                   ] 21% eta 19s\n'
					  	'\u001b[1A                                          '
						'\n\u001b[1Afoo [=====                   ] 22% eta 18s\n'
					].join('')

					m.chai.expect(@stdout.data).to.equal(progress)

				it 'should print progress bar with a new message', ->
					m.chai.expect(@stdout.data).to.equal('')
					@progress.update(percentage: 20, eta: 20, message: 'bar')

					progress = '\n\u001b[1Abar [=====                   ] 20% eta 20s\n'
					m.chai.expect(@stdout.data).to.equal(progress)
