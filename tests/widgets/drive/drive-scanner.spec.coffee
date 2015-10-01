m = require('mochainon')
_ = require('lodash')
Promise = require('bluebird')
DriveScanner = require('../../../lib/widgets/drive/drive-scanner')

describe 'Drive Scanner:', ->

	describe 'given pre-populated drive options', ->

		beforeEach ->
			@driveFinder = ->
				return Promise.resolve([ { foo: 'bar' } ])

		it 'should cause the drives class property to contain the same pre-existing drives', ->
			scanner = new DriveScanner @driveFinder,
				interval: 100
				drives: [ { foo: 'bar' } ]
			m.chai.expect(scanner.drives).to.deep.equal([ { foo: 'bar' } ])
			scanner.stop()

	describe 'given none pre-existing drive options', ->

		beforeEach ->
			@driveFinder = ->
				return Promise.resolve([])

		it 'should cause the drives class property to be empty', ->
			scanner = new DriveScanner @driveFinder,
				interval: 100
				drives: []
			m.chai.expect(scanner.drives).to.deep.equal([])
			scanner.stop()

	describe 'given a driveFinder that finds one drive that has been added', ->

		beforeEach ->
			@driveFinder = ->
				return Promise.resolve([ { foo: 'bar' } ])

		it 'should emit a single add event', (done) ->
			scanner = new DriveScanner(@driveFinder, interval: 100)
			removeSpy = m.sinon.spy()
			m.chai.expect(removeSpy).to.not.have.been.called
			scanner.on 'add', (drive) ->
				m.chai.expect(scanner.drives).to.deep.equal([ { foo: 'bar' } ])
				m.chai.expect(drive).to.deep.equal(foo: 'bar')
				scanner.stop()
				done()

	describe 'given a driveFinder that finds one drive that has been removed', ->

		beforeEach ->
			@driveFinder = m.sinon.stub()
			@driveFinder.returns(Promise.resolve([]))

		it 'should emit a single remove event', (done) ->
			scanner = new DriveScanner @driveFinder,
				interval: 100
				drives: [ { foo: 'bar' } ]
			addSpy = m.sinon.spy()
			m.chai.expect(addSpy).to.not.have.been.called
			scanner.on 'remove', (drive) ->
				m.chai.expect(scanner.drives).to.deep.equal([])
				m.chai.expect(drive).to.deep.equal(foo: 'bar')
				scanner.stop()
				done()

	describe 'given a driveFinder that finds one drive that has been changed', ->

		beforeEach ->
			@driveFinder = m.sinon.stub()
			@driveFinder.onFirstCall().returns(Promise.resolve([ { foo: 'bar' } ]))
			@driveFinder.returns(Promise.resolve([ { foo: 'baz' } ]))

		it 'should emit a remote and an add event', (done) ->
			scanner = new DriveScanner(@driveFinder, interval: 100)
			removeSpy = m.sinon.spy()
			scanner.on('remove', removeSpy)
			addSpy = m.sinon.spy()
			scanner.on('add', addSpy)
			setTimeout ->
				m.chai.expect(removeSpy).to.have.been.calledWith(foo: 'bar')
				m.chai.expect(addSpy).to.have.been.calledWith(foo: 'baz')
				scanner.stop()
				done()
			, 500

	describe 'given that nothing happens', ->

		beforeEach ->
			@driveFinder = ->
				return Promise.resolve([])

		it 'should emit no events', (done) ->
			scanner = new DriveScanner(@driveFinder, interval: 100)
			removeSpy = m.sinon.spy()
			scanner.on('remove', removeSpy)
			addSpy = m.sinon.spy()
			scanner.on('add', addSpy)
			setTimeout ->
				m.chai.expect(removeSpy).to.not.have.been.called
				m.chai.expect(addSpy).to.not.have.been.called
				scanner.stop()
				done()
			, 500

	describe 'given two additions that happen at the same time', ->

		beforeEach ->
			@driveFinder = ->
				return Promise.resolve([ { foo: 'bar' }, { foo: 'baz' } ])

		it 'should emit two add events', (done) ->
			scanner = new DriveScanner(@driveFinder, interval: 100)
			addSpy = m.sinon.spy()
			scanner.on('add', addSpy)
			removeSpy = m.sinon.spy()
			scanner.on('remove', removeSpy)
			setTimeout ->
				m.chai.expect(addSpy).to.have.been.calledTwice
				m.chai.expect(removeSpy).to.not.have.been.called
				m.chai.expect(addSpy).to.have.been.calledWith(foo: 'bar')
				m.chai.expect(addSpy).to.have.been.calledWith(foo: 'baz')
				scanner.stop()
				done()
			, 500

	describe 'given two removals that happen at the same time', ->

		beforeEach ->
			@driveFinder = ->
				return Promise.resolve([])

		it 'should emit two remove events', (done) ->
			scanner = new DriveScanner @driveFinder,
				interval: 100
				drives: [
					{ foo: 'bar' }
					{ foo: 'baz' }
				]

			removeSpy = m.sinon.spy()
			scanner.on('remove', removeSpy)
			addSpy = m.sinon.spy()
			scanner.on('add', addSpy)
			setTimeout ->
				m.chai.expect(addSpy).to.not.have.been.called
				m.chai.expect(removeSpy).to.have.been.calledTwice
				m.chai.expect(removeSpy).to.have.been.calledWith(foo: 'bar')
				m.chai.expect(removeSpy).to.have.been.calledWith(foo: 'baz')
				scanner.stop()
				done()
			, 500

	describe 'given an instantiated drive scanner', ->

		beforeEach ->
			@scanner = new DriveScanner ->
				return Promise.resolve([])

		afterEach ->
			@scanner.stop()

		it 'should throw an error if stop() can not find the interval id', ->
			m.chai.expect =>
				@scanner.stop.call(null)
			.to.throw('Can\'t stop interval. Are you calling stop() with the right context?')
