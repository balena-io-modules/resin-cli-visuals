os = require('os')
_ = require('lodash')
chai = require('chai')
expect = chai.expect
sinon = require('sinon')
chai.use(require('sinon-chai'))
manifest = require('../lib/manifest')

describe 'Manifest:', ->

	describe '.parseInstructions()', ->

		describe 'given plain instructions', ->

			beforeEach ->
				@instructions = [
					'Use <code>dd</code> or <code>Pi Filler</code> software to burn the .img to your SD card.<br>'

					'<strong>Warning!</strong>&nbsp;This step is dangerous. You can see a full description of this process'
					'<a href=\"http://docs.resin.io/#/pages/installing/gettingStarted.md\">here</a>.<br>'
					'Safely eject the freshly burnt SD card and insert into the Raspberry Pi.<br>'
					'Connect your device to the internet, then boot it up.'
				]

			it 'should be able to return plain text instructions', ->
				result = manifest.parseInstructions(@instructions)
				expect(result).to.equal '''
						Use dd or Pi Filler software to burn the .img to your SD card.
						Warning! This step is dangerous. You can see a full description of this process here [http://docs.resin.io/#/pages/installing/gettingStarted.md] .
						Safely eject the freshly burnt SD card and insert into the Raspberry Pi.
						Connect your device to the internet, then boot it up.
				'''

		describe 'given per os instructions', ->

			beforeEach ->
				@instructions =
					osx: [ '<h1>OS X Instructions</h1>' ]
					linux: [ '<h1>Linux Instructions</h1>' ]
					windows: [ '<h1>Windows Instructions</h1>' ]

			describe 'given darwin', ->

				beforeEach ->
					@osPlatformStub = sinon.stub(os, 'platform')
					@osPlatformStub.returns('darwin')

				afterEach ->
					@osPlatformStub.restore()

				it 'should return os x instructions', ->
					result = manifest.parseInstructions(@instructions)
					expect(result).to.equal('OS X INSTRUCTIONS')

			describe 'given linux', ->

				beforeEach ->
					@osPlatformStub = sinon.stub(os, 'platform')
					@osPlatformStub.returns('linux')

				afterEach ->
					@osPlatformStub.restore()

				it 'should return linux instructions', ->
					result = manifest.parseInstructions(@instructions)
					expect(result).to.equal('LINUX INSTRUCTIONS')

			describe 'given win32', ->

				beforeEach ->
					@osPlatformStub = sinon.stub(os, 'platform')
					@osPlatformStub.returns('win32')

				afterEach ->
					@osPlatformStub.restore()

				it 'should return windows instructions', ->
					result = manifest.parseInstructions(@instructions)
					expect(result).to.equal('WINDOWS INSTRUCTIONS')

			describe 'given an unknown platform', ->

				beforeEach ->
					@osPlatformStub = sinon.stub(os, 'platform')
					@osPlatformStub.returns('foobar')

				afterEach ->
					@osPlatformStub.restore()

				it 'should return an empty string', ->
					result = manifest.parseInstructions(@instructions)
					expect(result).to.equal('')

		describe 'given no instructions', ->

			it 'should return an empty string', ->
				result = manifest.parseInstructions(null)
				expect(result).to.equal('')
