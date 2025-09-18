import { expect } from 'chai';
import { compare } from '../../../lib/widgets/drive/compare';

describe('Drive Compare:', function () {
	it('should compare a single drive addition', function () {
		const previous = [{ foo: 'bar' }];

		const current = [{ foo: 'bar' }, { bar: 'baz' }];

		expect(compare(previous, current)).to.deep.equal({
			drives: [{ foo: 'bar' }, { bar: 'baz' }],
			diff: [
				{
					type: 'add',
					drive: {
						bar: 'baz',
					},
				},
			],
		});
	});

	it('should compare multiple drive additions while having no other drives attached previously', function () {
		const previous: unknown[] = [];

		const current = [{ foo: 'bar' }, { foo: 'baz' }];

		expect(compare(previous, current)).to.deep.equal({
			drives: [{ foo: 'bar' }, { foo: 'baz' }],

			diff: [
				{
					type: 'add',
					drive: {
						foo: 'bar',
					},
				},
				{
					type: 'add',
					drive: {
						foo: 'baz',
					},
				},
			],
		});
	});

	it('should compare multiple drive additions', function () {
		const previous = [{ foo: 'bar' }];

		const current = [{ foo: 'bar' }, { bar: 'baz' }, { baz: 'bar' }];

		expect(compare(previous, current)).to.deep.equal({
			drives: [{ foo: 'bar' }, { bar: 'baz' }, { baz: 'bar' }],
			diff: [
				{
					type: 'add',
					drive: {
						bar: 'baz',
					},
				},
				{
					type: 'add',
					drive: {
						baz: 'bar',
					},
				},
			],
		});
	});

	it('should compare a single drive removal', function () {
		const previous = [{ foo: 'bar' }, { bar: 'baz' }];

		const current = [{ foo: 'bar' }];

		expect(compare(previous, current)).to.deep.equal({
			drives: [{ foo: 'bar' }],

			diff: [
				{
					type: 'remove',
					drive: {
						bar: 'baz',
					},
				},
			],
		});
	});

	it('should compare multiple drive removals', function () {
		const previous = [{ foo: 'bar' }, { bar: 'baz' }, { baz: 'bar' }];

		const current = [{ baz: 'bar' }];

		expect(compare(previous, current)).to.deep.equal({
			drives: [{ baz: 'bar' }],

			diff: [
				{
					type: 'remove',
					drive: {
						foo: 'bar',
					},
				},
				{
					type: 'remove',
					drive: {
						bar: 'baz',
					},
				},
			],
		});
	});

	it('should compare drive additions when running the command with no drives attached', function () {
		const previous: unknown[] = [];

		const current = [{ foo: 'bar' }];

		expect(compare(previous, current)).to.deep.equal({
			drives: [{ foo: 'bar' }],

			diff: [
				{
					type: 'add',
					drive: {
						foo: 'bar',
					},
				},
			],
		});
	});

	it('should compare drive removals when unplugging all the available drives after running the command', function () {
		const previous = [{ foo: 'bar' }];

		const current: unknown[] = [];

		expect(compare(previous, current)).to.deep.equal({
			drives: [],

			diff: [
				{
					type: 'remove',
					drive: {
						foo: 'bar',
					},
				},
			],
		});
	});

	it('should do nothing when no change has happened', function () {
		const previous: unknown[] = [];

		const current: unknown[] = [];

		expect(compare(previous, current)).to.deep.equal({
			drives: [],
			diff: [],
		});
	});

	it('should compare one drive add and removal operation that happened sequentially', function () {
		let previous: unknown[] = [];

		let current = [{ foo: 'bar' }];

		expect(compare(previous, current)).to.deep.equal({
			drives: [{ foo: 'bar' }],

			diff: [
				{
					type: 'add',
					drive: {
						foo: 'bar',
					},
				},
			],
		});

		previous = [{ foo: 'bar' }];

		current = [];

		expect(compare(previous, current)).to.deep.equal({
			drives: [],

			diff: [
				{
					type: 'remove',
					drive: {
						foo: 'bar',
					},
				},
			],
		});
	});

	it('should compare a single drive removal with two drive additions that happened after it', function () {
		const previous = [{ foo: 'bar' }];

		const current = [{ bar: 'baz' }, { baz: 'bar' }];

		expect(compare(previous, current)).to.deep.equal({
			drives: [{ bar: 'baz' }, { baz: 'bar' }],

			diff: [
				{
					type: 'add',
					drive: {
						bar: 'baz',
					},
				},
				{
					type: 'add',
					drive: {
						baz: 'bar',
					},
				},
				{
					type: 'remove',
					drive: {
						foo: 'bar',
					},
				},
			],
		});
	});

	it('should compare a drive that has been changed', function () {
		const previous = [{ foo: 'bar' }];

		const current = [{ foo: 'baz' }];

		expect(compare(previous, current)).to.deep.equal({
			drives: [{ foo: 'baz' }],

			diff: [
				{
					type: 'add',
					drive: {
						foo: 'baz',
					},
				},
				{
					type: 'remove',
					drive: {
						foo: 'bar',
					},
				},
			],
		});
	});
});
