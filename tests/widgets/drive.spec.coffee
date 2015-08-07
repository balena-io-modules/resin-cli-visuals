m = require('mochainon')
drivelist = require('drivelist')
drive = require('../../lib/widgets/drive')

describe 'Drive:', ->

	describe '.drive()', ->

		describe 'given no drives', ->

			beforeEach ->
				@drivelistListStub = m.sinon.stub(drivelist, 'list')
				@drivelistListStub.yields(null, [])

			afterEach ->
				@drivelistListStub.restore()

			it 'should be rejected with an error', ->
				m.chai.expect(drive()).to.be.rejectedWith('No available drives')
