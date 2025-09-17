m = require('mochainon')
compare = require('../../../lib/widgets/drive/compare')

describe 'Drive Compare:', ->

	it 'should compare a single drive addition', ->
		previous = [
			{ foo: 'bar' }
		]

		current = [
			{ foo: 'bar' }
			{ bar: 'baz' }
		]

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: [
				{ foo: 'bar' }
				{ bar: 'baz' }
			]
			diff: [
				{
					type: 'add'
					drive:
						bar: 'baz'
				}
			]

	it 'should compare multiple drive additions while having no other drives attached previously', ->
		previous = []

		current = [
			{ foo: 'bar' }
			{ foo: 'baz' }
		]

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: [
				{ foo: 'bar' }
				{ foo: 'baz' }
			]

			diff: [
				{
					type: 'add'
					drive:
						foo: 'bar'
				}
				{
					type: 'add'
					drive:
						foo: 'baz'
				}
			]

	it 'should compare multiple drive additions', ->
		previous = [
			{ foo: 'bar' }
		]

		current = [
			{ foo: 'bar' }
			{ bar: 'baz' }
			{ baz: 'bar' }
		]

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: [
				{ foo: 'bar' }
				{ bar: 'baz' }
				{ baz: 'bar' }
			]
			diff: [
				{
					type: 'add'
					drive:
						bar: 'baz'
				}
				{
					type: 'add'
					drive:
						baz: 'bar'
				}
			]

	it 'should compare a single drive removal', ->
		previous = [
			{ foo: 'bar' }
			{ bar: 'baz' }
		]

		current = [
			{ foo: 'bar' }
		]

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: [
				{ foo: 'bar' }
			]

			diff: [
				{
					type: 'remove'
					drive:
						bar: 'baz'
				}
			]

	it 'should compare multiple drive removals', ->
		previous = [
			{ foo: 'bar' }
			{ bar: 'baz' }
			{ baz: 'bar' }
		]

		current = [
			{ baz: 'bar' }
		]

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: [
				{ baz: 'bar' }
			]

			diff: [
				{
					type: 'remove'
					drive:
						foo: 'bar'
				}
				{
					type: 'remove'
					drive:
						bar: 'baz'
				}
			]

	it 'should compare drive additions when running the command with no drives attached', ->
		previous = []

		current = [
			{ foo: 'bar' }
		]

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: [
				{ foo: 'bar' }
			]

			diff: [
				{
					type: 'add'
					drive:
						foo: 'bar'
				}
			]

	it 'should compare drive removals when unplugging all the available drives after running the command', ->
		previous = [
			{ foo: 'bar' }
		]

		current = []

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: []

			diff: [
				{
					type: 'remove'
					drive:
						foo: 'bar'
				}
			]

	it 'should do nothing when no change has happened', ->
		previous = []

		current = []

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: []
			diff: []

	it 'should compare one drive add and removal operation that happened sequentially', ->
		previous = []

		current = [
			{ foo: 'bar' }
		]

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: [
				{ foo: 'bar' }
			]

			diff: [
				{
					type: 'add'
					drive:
						foo: 'bar'
				}
			]

		previous = [
			{ foo: 'bar' }
		]

		current = []

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: []

			diff: [
				{
					type: 'remove'
					drive:
						foo: 'bar'
				}
			]

	it 'should compare a single drive removal with two drive additions that happened after it', ->
		previous = [
			{ foo: 'bar' }
		]

		current = [
			{ bar: 'baz' }
			{ baz: 'bar' }
		]

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: [
				{ bar: 'baz' }
				{ baz: 'bar' }
			]

			diff: [
				{
					type: 'add'
					drive:
						bar: 'baz'
				}
				{
					type: 'add'
					drive:
						baz: 'bar'
				}
				{
					type: 'remove'
					drive:
						foo: 'bar'
				}
			]

	it 'should compare a drive that has been changed', ->
		previous = [
			{ foo: 'bar' }
		]

		current = [
			{ foo: 'baz' }
		]

		m.chai.expect(compare(previous, current)).to.deep.equal
			drives: [
				{ foo: 'baz' }
			]

			diff: [
				{
					type: 'add'
					drive:
						foo: 'baz'
				}
				{
					type: 'remove'
					drive:
						foo: 'bar'
				}
			]
