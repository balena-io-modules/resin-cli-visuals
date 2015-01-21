expect = require('chai').expect
table = require('../../lib/widgets/table')

OBJECTS =
	valid:
		One: 'one'
		Two: 'two'
		Three: 'three'

describe 'Table:', ->

	describe '#vertical()', ->

		it 'should return a string respecting the ordering', ->
			ordering = [ 'One', 'Two', 'Three' ]
			result = table.vertical(OBJECTS.valid, null, ordering).split('\n')
			expected = [
				'One: one'
				'Two: two'
				'Three: three'
			]

			expect(result).to.deep.equal(expected)

		it 'should be able to print everything without explicit ordering', ->
			result = table.vertical(OBJECTS.valid, null).split('\n')
			expected = [
				'One: one'
				'Two: two'
				'Three: three'
			]

			for line in expected
				expect(result.indexOf(line)).to.not.equal(-1)

		it 'should return undefined if contents does not exist', ->
			expect(table.vertical(undefined)).to.be.undefined

	describe '#horizontal()', ->

		it 'should return undefined if contents does not exist', ->
			expect(table.horizontal(undefined)).to.be.undefined
