/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const m = require('mochainon');
const table = require('../../lib/widgets/table');

describe('Table:', function() {

	describe('.horizontal()', function() {

		it('should return undefined if no data', function() {
			const output = table.horizontal(null);
			return m.chai.expect(output).to.be.undefined;
		});

		it('should obey the imposed ordering', function() {
			const output = table.horizontal([{
					name: 'John Doe',
					age: 40,
					job: 'Developer'
				}
				, {
					name: 'Jane Doe',
					age: 30,
					job: 'Designer'
				}
			], [ 'job', 'age', 'name' ]);

			return m.chai.expect(output).to.equal([
				'JOB       AGE NAME',
				'Developer 40  John Doe',
				'Designer  30  Jane Doe'
			].join('\n')
			);
		});

		it('should preserve new lines', function() {
			const output = table.horizontal([{
					name: 'John Doe',
					age: 40,
					job: 'Developer\nMusician'
				}
				, {
					name: 'Jane Doe',
					age: 30,
					job: 'Designer\nActress'
				}
			], [ 'name', 'age', 'job' ]);

			return m.chai.expect(output).to.equal([
				'NAME     AGE JOB',
				'John Doe 40  Developer',
				'             Musician',
				'Jane Doe 30  Designer',
				'             Actress'
			].join('\n')
			);
		});

		it('should remove underscores from titles', function() {
			const output = table.horizontal([{
					first_name: 'John',
					last_name: 'Doe'
				}
				, {
					first_name: 'Jane',
					last_name: 'Doe'
				}
			], [ 'first_name', 'last_name' ]);

			return m.chai.expect(output).to.equal([
				'FIRST NAME LAST NAME',
				'John       Doe',
				'Jane       Doe'
			].join('\n')
			);
		});

		it('should handle camel case titles', function() {
			const output = table.horizontal([{
					firstName: 'John',
					lastName: 'Doe'
				}
				, {
					firstName: 'Jane',
					lastName: 'Doe'
				}
			], [ 'firstName', 'lastName' ]);

			return m.chai.expect(output).to.equal([
				'FIRST NAME LAST NAME',
				'John       Doe',
				'Jane       Doe'
			].join('\n')
			);
		});

		it('should print all data if no ordering', function() {
			const output = table.horizontal([{
					name: 'John Doe',
					age: 40,
					job: 'Developer'
				}
				, {
					name: 'Jane Doe',
					age: 30,
					job: 'Designer'
				}
			]);

			return m.chai.expect(output).to.equal([
				'NAME     AGE JOB',
				'John Doe 40  Developer',
				'Jane Doe 30  Designer'
			].join('\n')
			);
		});

		return it('should be able to dynamically rename columns', function() {
			const output = table.horizontal([{
					name: 'John Doe',
					age: 40,
					job: 'Developer'
				}
				, {
					name: 'Jane Doe',
					age: 30,
					job: 'Designer'
				}
			], [
				'name => The name',
				'age => How old?',
				'job => Life reason'
			]);

			return m.chai.expect(output).to.equal([
				'THE NAME HOW OLD? LIFE REASON',
				'John Doe 40       Developer',
				'Jane Doe 30       Designer'
			].join('\n')
			);
		});
	});

	return describe('.vertical()', function() {

		it('should output a vertical table', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer'
			}
			, [ 'name', 'age', 'job' ]);

			return m.chai.expect(output).to.equal([
				'NAME: John Doe',
				'AGE:  40',
				'JOB:  Developer'
			].join('\n')
			);
		});

		it('should obey the imposed ordering', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer'
			}
			, [ 'age', 'job', 'name' ]);

			return m.chai.expect(output).to.equal([
				'AGE:  40',
				'JOB:  Developer',
				'NAME: John Doe'
			].join('\n')
			);
		});

		it('should preserve new lines', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer\nMusician'
			}
			, [ 'name', 'age', 'job' ]);

			return m.chai.expect(output).to.equal([
				'NAME: John Doe',
				'AGE:  40',
				'JOB:  Developer',
				'      Musician'
			].join('\n')
			);
		});

		it('should remove underscores from titles', function() {
			const output = table.vertical({
				first_name: 'John',
				last_name: 'Doe'
			}
			, [ 'first_name', 'last_name' ]);

			return m.chai.expect(output).to.equal([
				'FIRST NAME: John',
				'LAST NAME:  Doe'
			].join('\n')
			);
		});

		it('should handle camel case titles', function() {
			const output = table.vertical({
				firstName: 'John',
				lastName: 'Doe'
			}
			, [ 'firstName', 'lastName' ]);

			return m.chai.expect(output).to.equal([
				'FIRST NAME: John',
				'LAST NAME:  Doe'
			].join('\n')
			);
		});

		it('should print all data if no ordering', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer'
			});

			return m.chai.expect(output).to.equal([
				'NAME: John Doe',
				'AGE:  40',
				'JOB:  Developer'
			].join('\n')
			);
		});

		it('should be able to dynamically rename columns', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer'
			}
			, [
				'name => The name',
				'age => How old?',
				'job => Life reason'
			]);

			return m.chai.expect(output).to.equal([
				'THE NAME:    John Doe',
				'HOW OLD?:    40',
				'LIFE REASON: Developer'
			].join('\n')
			);
		});

		it('should support separators as empty string', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer',
				hobby: 'Musician'
			}
			, [
				'name',
				'age',
				'',
				'job',
				'hobby'
			]);

			return m.chai.expect(output).to.equal([
				'NAME:  John Doe',
				'AGE:   40',
				'',
				'JOB:   Developer',
				'HOBBY: Musician'
			].join('\n')
			);
		});

		it('should support separators as null', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer',
				hobby: 'Musician'
			}
			, [
				'name',
				'age',
				null,
				'job',
				'hobby'
			]);

			return m.chai.expect(output).to.equal([
				'NAME:  John Doe',
				'AGE:   40',
				'',
				'JOB:   Developer',
				'HOBBY: Musician'
			].join('\n')
			);
		});

		it('should support separators as blank strings', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer',
				hobby: 'Musician'
			}
			, [
				'name',
				'age',
				'     ',
				'job',
				'hobby'
			]);

			return m.chai.expect(output).to.equal([
				'NAME:  John Doe',
				'AGE:   40',
				'',
				'JOB:   Developer',
				'HOBBY: Musician'
			].join('\n')
			);
		});

		it('should support multiple separators', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer',
				hobby: 'Musician'
			}
			, [
				'name',
				'',
				'age',
				'',
				'job',
				'',
				'hobby'
			]);

			return m.chai.expect(output).to.equal([
				'NAME:  John Doe',
				'',
				'AGE:   40',
				'',
				'JOB:   Developer',
				'',
				'HOBBY: Musician'
			].join('\n')
			);
		});

		it('should support group subtitles', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer',
				hobby: 'Musician'
			}
			, [
				'$summary$',
				'name',
				'age',
				'',
				'$extras$',
				'job',
				'hobby'
			]);

			return m.chai.expect(output).to.equal([
				'== SUMMARY',
				'NAME:  John Doe',
				'AGE:   40',
				'',
				'== EXTRAS',
				'JOB:   Developer',
				'HOBBY: Musician'
			].join('\n')
			);
		});

		return it('should support multi word group subtitles', function() {
			const output = table.vertical({
				name: 'John Doe',
				age: 40,
				job: 'Developer'
			}
			, [
				'$person short summary$',
				'name',
				'age'
			]);

			return m.chai.expect(output).to.equal([
				'== PERSON SHORT SUMMARY',
				'NAME: John Doe',
				'AGE:  40'
			].join('\n')
			);
		});
	});
});
