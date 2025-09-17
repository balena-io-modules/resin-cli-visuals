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

const containsDeep = (array: unknown[], item: unknown) =>
	array.map(_.partial(_.isEqual, item)).some((x) => x);

const differenceDeep = <T>(x: T[], y: T[]) =>
	x.filter(_.partial(_.negate(containsDeep), y));

const createDiffOperation = (type: string, element: string) => ({
	type,
	drive: element,
});

/**
 * @summary Detect changes regarding drives between different time intervals
 * @function
 * @protected
 *
 * @param {Array} - previous drive list
 * @param {Array} - current drive list
 * @returns {Object[]} - current drive list, potential differences with previous one
 *
 * @example
 * compare(previousDrives, currentDrives)
 */
export function compare(previous: unknown[], current: unknown[]) {
	const additions = differenceDeep(current, previous);
	const removals = differenceDeep(previous, current);

	const mappingAdditions = additions.map(_.partial(createDiffOperation, 'add'));
	const mappingRemovals = removals.map(
		_.partial(createDiffOperation, 'remove'),
	);

	return {
		drives: current,
		diff: _.union(mappingAdditions, mappingRemovals),
	};
}
