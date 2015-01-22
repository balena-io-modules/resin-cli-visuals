expect = require('chai').expect
table = require('../../lib/widgets/table')

describe 'Table:', ->

	describe '#vertical()', ->

		it 'should return undefined if contents does not exist', ->
			expect(table.vertical(undefined)).to.be.undefined

		it 'should return undefined if no ordering', ->
			expect(table.vertical({ foo: 'bar' })).to.be.undefined

		it 'should return undefined if ordering is empty', ->
			expect(table.vertical({ foo: 'bar'}, [])).to.be.undefined

		it 'should return a string respecting the ordering', ->
			ordering = [ 'Two', 'One', 'Three' ]

			result = table.vertical({
				One: 'one'
				Two: 'two'
				Three: 'three'
			}, ordering).split('\n')

			expected = [
				'TWO: two'
				'ONE: one'
				'THREE: three'
			]

			expect(result).to.deep.equal(expected)

	describe '#horizontal()', ->

		it 'should return undefined if contents does not exist', ->
			expect(table.horizontal(undefined)).to.be.undefined

		it 'should return undefined if no ordering', ->
			expect(table.horizontal([foo: 'bar'])).to.be.undefined

		it 'should return undefined if ordering is empty', ->
			expect(table.horizontal([foo: 'bar'], [])).to.be.undefined

		describe 'given empty contents', ->

			it 'should return undefined', ->
				result = table.horizontal([], [ 'hello' ])
				expect(result).to.equal [
					'HELLO'
				].join('\n')

		describe 'given single item data', ->

			beforeEach ->
				@data = [
					{
						foo: 'bar'
						bar: 'baz'
					}
				]

			it 'should construct the table correctly', ->
				result = table.horizontal(@data, [ 'foo', 'bar' ])
				expect(result).to.equal [
					'FOO BAR'
					'bar baz'
				].join('\n')

		describe 'given multi item data', ->

			beforeEach ->
				@data = [
					{
						foo: 'bar'
						bar: 'baz'
					}
					{
						foo: 'hello'
						bar: 'world'
					}
				]

			it 'should construct multi item tables correctly', ->
				result = table.horizontal(@data, [ 'foo', 'bar' ])
				expect(result).to.equal [
					'FOO   BAR'
					'bar   baz'
					'hello world'
				].join('\n')

			it 'should be able to swap the ordering', ->
				result = table.horizontal(@data, [ 'bar', 'foo' ])
				expect(result).to.equal [
					'BAR   FOO'
					'baz   bar'
					'world hello'
				].join('\n')

		describe 'given multi word headers data', ->

			beforeEach ->
				@data = [
					hello_world: 'hey'
					foo_bar: 'baz'
				]

			it 'should remove the underscore', ->
				result = table.horizontal(@data, [ 'hello_world', 'foo_bar' ])
				expect(result).to.equal [
					'HELLO WORLD FOO BAR'
					'hey         baz'
				 ].join('\n')

		describe 'inconsistent data', ->

			beforeEach ->
				@data = [
					{
						one: 'one'
						two: 'two'
					}
					{
						two: 'two'
						three: 'three'
					}
				]

			it 'should ignore items not in ordering', ->
				result = table.horizontal(@data, [ 'two' ])
				expect(result).to.equal [
					'TWO'
					'two'
					'two'
				].join('\n')
