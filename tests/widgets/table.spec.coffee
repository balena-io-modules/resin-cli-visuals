expect = require('chai').expect
table = require('../../lib/widgets/table')

describe 'Table:', ->

	describe '#vertical()', ->

		it 'should return a string respecting the ordering', ->
			ordering = [ 'One', 'Two', 'Three' ]

			result = table.vertical({
				One: 'one'
				Two: 'two'
				Three: 'three'
			}, ordering).split('\n')

			expected = [
				'ONE: one'
				'TWO: two'
				'THREE: three'
			]

			expect(result).to.deep.equal(expected)

		it 'should return undefined if contents does not exist', ->
			expect(table.vertical(undefined)).to.be.undefined

	describe '#horizontal()', ->

		it 'should return undefined if contents does not exist', ->
			expect(table.horizontal(undefined)).to.be.undefined
