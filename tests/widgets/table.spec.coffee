m = require('mochainon')
table = require('../../lib/widgets/table')

describe 'Table:', ->

	describe '.horizontal()', ->

		it 'should return undefined if no data', ->
			output = table.horizontal(null)
			m.chai.expect(output).to.be.undefined

		it 'should obey the imposed ordering', ->
			output = table.horizontal [
					name: 'John Doe'
					age: 40
					job: 'Developer'
				,
					name: 'Jane Doe'
					age: 30
					job: 'Designer'
			], [ 'job', 'age', 'name' ]

			m.chai.expect(output).to.equal [
				'JOB       AGE NAME'
				'Developer 40  John Doe'
				'Designer  30  Jane Doe'
			].join('\n')

		it 'should preserve new lines', ->
			output = table.horizontal [
					name: 'John Doe'
					age: 40
					job: 'Developer\nMusician'
				,
					name: 'Jane Doe'
					age: 30
					job: 'Designer\nActress'
			], [ 'name', 'age', 'job' ]

			m.chai.expect(output).to.equal [
				'NAME     AGE JOB'
				'John Doe 40  Developer'
				'             Musician'
				'Jane Doe 30  Designer'
				'             Actress'
			].join('\n')

		it 'should remove underscores from titles', ->
			output = table.horizontal [
					first_name: 'John'
					last_name: 'Doe'
				,
					first_name: 'Jane'
					last_name: 'Doe'
			], [ 'first_name', 'last_name' ]

			m.chai.expect(output).to.equal [
				'FIRST NAME LAST NAME'
				'John       Doe'
				'Jane       Doe'
			].join('\n')

		it 'should handle camel case titles', ->
			output = table.horizontal [
					firstName: 'John'
					lastName: 'Doe'
				,
					firstName: 'Jane'
					lastName: 'Doe'
			], [ 'firstName', 'lastName' ]

			m.chai.expect(output).to.equal [
				'FIRST NAME LAST NAME'
				'John       Doe'
				'Jane       Doe'
			].join('\n')

		it 'should print all data if no ordering', ->
			output = table.horizontal [
					name: 'John Doe'
					age: 40
					job: 'Developer'
				,
					name: 'Jane Doe'
					age: 30
					job: 'Designer'
			]

			m.chai.expect(output).to.equal [
				'NAME     AGE JOB'
				'John Doe 40  Developer'
				'Jane Doe 30  Designer'
			].join('\n')

		it 'should be able to dynamically rename columns', ->
			output = table.horizontal [
					name: 'John Doe'
					age: 40
					job: 'Developer'
				,
					name: 'Jane Doe'
					age: 30
					job: 'Designer'
			], [
				'name => The name'
				'age => How old?'
				'job => Life reason'
			]

			m.chai.expect(output).to.equal [
				'THE NAME HOW OLD? LIFE REASON'
				'John Doe 40       Developer'
				'Jane Doe 30       Designer'
			].join('\n')

	describe '.vertical()', ->

		it 'should output a vertical table', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer'
			, [ 'name', 'age', 'job' ]

			m.chai.expect(output).to.equal [
				'NAME: John Doe'
				'AGE:  40'
				'JOB:  Developer'
			].join('\n')

		it 'should obey the imposed ordering', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer'
			, [ 'age', 'job', 'name' ]

			m.chai.expect(output).to.equal [
				'AGE:  40'
				'JOB:  Developer'
				'NAME: John Doe'
			].join('\n')

		it 'should preserve new lines', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer\nMusician'
			, [ 'name', 'age', 'job' ]

			m.chai.expect(output).to.equal [
				'NAME: John Doe'
				'AGE:  40'
				'JOB:  Developer'
				'      Musician'
			].join('\n')

		it 'should remove underscores from titles', ->
			output = table.vertical
				first_name: 'John'
				last_name: 'Doe'
			, [ 'first_name', 'last_name' ]

			m.chai.expect(output).to.equal [
				'FIRST NAME: John'
				'LAST NAME:  Doe'
			].join('\n')

		it 'should handle camel case titles', ->
			output = table.vertical
				firstName: 'John'
				lastName: 'Doe'
			, [ 'firstName', 'lastName' ]

			m.chai.expect(output).to.equal [
				'FIRST NAME: John'
				'LAST NAME:  Doe'
			].join('\n')

		it 'should print all data if no ordering', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer'

			m.chai.expect(output).to.equal [
				'NAME: John Doe'
				'AGE:  40'
				'JOB:  Developer'
			].join('\n')

		it 'should be able to dynamically rename columns', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer'
			, [
				'name => The name'
				'age => How old?'
				'job => Life reason'
			]

			m.chai.expect(output).to.equal [
				'THE NAME:    John Doe'
				'HOW OLD?:    40'
				'LIFE REASON: Developer'
			].join('\n')

		it 'should support separators as empty string', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer'
				hobby: 'Musician'
			, [
				'name'
				'age'
				''
				'job'
				'hobby'
			]

			m.chai.expect(output).to.equal [
				'NAME:  John Doe'
				'AGE:   40'
				''
				'JOB:   Developer'
				'HOBBY: Musician'
			].join('\n')

		it 'should support separators as null', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer'
				hobby: 'Musician'
			, [
				'name'
				'age'
				null
				'job'
				'hobby'
			]

			m.chai.expect(output).to.equal [
				'NAME:  John Doe'
				'AGE:   40'
				''
				'JOB:   Developer'
				'HOBBY: Musician'
			].join('\n')

		it 'should support separators as blank strings', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer'
				hobby: 'Musician'
			, [
				'name'
				'age'
				'     '
				'job'
				'hobby'
			]

			m.chai.expect(output).to.equal [
				'NAME:  John Doe'
				'AGE:   40'
				''
				'JOB:   Developer'
				'HOBBY: Musician'
			].join('\n')

		it 'should support multiple separators', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer'
				hobby: 'Musician'
			, [
				'name'
				''
				'age'
				''
				'job'
				''
				'hobby'
			]

			m.chai.expect(output).to.equal [
				'NAME:  John Doe'
				''
				'AGE:   40'
				''
				'JOB:   Developer'
				''
				'HOBBY: Musician'
			].join('\n')

		it 'should support group subtitles', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer'
				hobby: 'Musician'
			, [
				'$summary$'
				'name'
				'age'
				''
				'$extras$'
				'job'
				'hobby'
			]

			m.chai.expect(output).to.equal [
				'== SUMMARY'
				'NAME:  John Doe'
				'AGE:   40'
				''
				'== EXTRAS'
				'JOB:   Developer'
				'HOBBY: Musician'
			].join('\n')

		it 'should support multi word group subtitles', ->
			output = table.vertical
				name: 'John Doe'
				age: 40
				job: 'Developer'
			, [
				'$person short summary$'
				'name'
				'age'
			]

			m.chai.expect(output).to.equal [
				'== PERSON SHORT SUMMARY'
				'NAME: John Doe'
				'AGE:  40'
			].join('\n')
