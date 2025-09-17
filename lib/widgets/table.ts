/*
Copyright 2016 Resin.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as _ from 'lodash';
import columnify from 'columnify';

type Ordering =
	| { type: 'separator' }
	| {
			type: 'subtitle';
			value: string;
	  }
	| {
			type: 'column';
			name: string;
			alias: string;
			value: unknown;
	  };

/**
 * @namespace table
 * @memberof visuals
 */

const parseOrdering = (ordering: string[], data: object): Ordering[] =>
	_.compact(
		_.map(ordering, function (column) {
			if (_.trim(column) === '') {
				return {
					type: 'separator',
				};
			}

			const subtitleMatches = column.match(/^\$(.+)\$$/);

			if (subtitleMatches != null) {
				return {
					type: 'subtitle',
					value: subtitleMatches[1],
				};
			}

			const aliasMatches = column.match(/^(.+) => (.+)$/);

			const name =
				(aliasMatches != null ? aliasMatches[1] : undefined) ?? column;
			const result = {
				type: 'column',
				name: name,
				alias: (aliasMatches != null ? aliasMatches[2] : undefined) ?? column,
				value: (data as Record<string, unknown>)[name],
			} satisfies Ordering;

			return result;
		}),
	);

const getAlias = (ordering: Ordering[], column: string): string | undefined =>
	_.result(_.find(ordering, { name: column }), 'alias');

const normalizeTitle = (title: string) =>
	_.trim(title)
		.replace(/([a-z\d])([A-Z]+)/g, '$1 $2')
		.replace(/[_-\s]+/g, ' ')
		.toUpperCase();

const normalizeSubtitle = (subtitle: string, width: number) =>
	_.padEnd(`== ${normalizeTitle(subtitle)}`, width, ' ');

const applySubtitles = function (table: string, ordering: Ordering[]) {
	const splitTable = table.split(/\r\n?|\n/);

	const titleizedTable = _.map(splitTable, function (row) {
		if (!_.startsWith(row, '$X$')) {
			return row;
		}
		const rowWidth = row.length;
		const rowIndex = _.indexOf(splitTable, row);
		const value = 'value' in ordering[rowIndex] ? `${ordering[rowIndex].value}` : '';
		return normalizeSubtitle(value, rowWidth);
	});

	return titleizedTable.join('\n');
};

const trimRight = function (table: string) {
	let splitTable = table.split(/\r\n?|\n/);
	splitTable = _.map(splitTable, (row) => _.trimEnd(row));
	return splitTable.join('\n');
};

/**
 * @summary Make an horizontal table
 * @name visuals.table.horizontal
 * @function
 * @public
 *
 * @description
 * Notice that you can rename columns by using the CURRENT => NEW syntax in the ordering configuration.
 *
 * @param {Object[]} data - table data
 * @param {String[]} ordering - display ordering
 *
 * @example
 * console.log visuals.table.horizontal [
 * 	{ name: 'John Doe', age: 40 }
 * 	{ name: 'Jane Doe', age: 35 }
 * ], [
 * 	'name => full name'
 * 	'age'
 * ]
 *
 * FULL NAME AGE
 * John Doe  40
 * Jane Doe  35
 */
export function horizontal(data: object[], ordering: string[]) {
	if (data == null) {
		return;
	}

	const orderingObj = parseOrdering(ordering, data);

	return trimRight(
		columnify(data, {
			// TODO: Try to remove the cast in a follow-up
			columns: _.map(orderingObj, 'name') as string[],
			preserveNewLines: true,
			headingTransform(heading) {
				// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- TODO Change me to a ?? in the next major to minimize code changes
				return normalizeTitle(getAlias(orderingObj, heading) || heading);
			},
		}),
	);
}

/**
 * @summary Make a vertical table
 * @name visuals.table.vertical
 * @function
 * @public
 *
 * @description
 * Notice that you can rename columns by using the CURRENT => NEW syntax in the ordering configuration.
 *
 * Vertical tables also accept separators and subtitles, which are represented in the ordering configuration as empty strings and strings surrounded by dollar signs respectively.
 *
 * @param {Object} data - table data
 * @param {String[]} [ordering] - display ordering
 *
 * @example
 * console.log visuals.table.vertical
 * 	name: 'John Doe'
 * 	age: 40
 * 	job: 'Developer'
 * , [
 * 	'$summary$'
 * 	'name => full name'
 * 	'age'
 * 	''
 * 	'$extras$'
 * 	'job'
 * ]
 *
 * == SUMMARY
 * FULL NAME: John Doe
 * AGE:       40
 *
 * == EXTRAS
 * JOB:       Developer
 */
export function vertical(data: object, ordering?: string[]) {
	ordering ??= _.keys(data);
	let orderingObj = parseOrdering(ordering, data);
	orderingObj = _.filter(
		orderingObj,
		(column) => column.type !== 'column' || column.value != null,
	);

	const orderedData = _.map(orderingObj, function (column, index) {
		if (column.type === 'separator') {
			return {
				property: null,
				value: null,
			};
		} else if (column.type === 'subtitle') {
			return {
				// We use $X$ to mark titles to be able to replace them later
				// since including it here as property will result in the title
				// expanding the column if it's larger than the other properties.
				// Using $X$ is efficient since there cannot be a case where
				// other property is surrounded by dollar signs at this point
				// since it would have been considered a title.
				// We also use an index after the token to be able to identify
				// it more easily.
				property: `$X$${index}`,

				value: null,
			};
		}

		return {
			property: normalizeTitle(column.alias) + ':',
			value: column.value,
		};
	});

	const table = columnify(orderedData, {
		showHeaders: false,
		columns: ['property', 'value'],
		preserveNewLines: true,
	});

	return trimRight(applySubtitles(table, orderingObj));
}
