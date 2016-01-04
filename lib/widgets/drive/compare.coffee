###
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
###

_ = require('lodash')

containsDeep = (array, item) ->
	return _.any(_.map(array, _.partial(_.isEqual, item)))

differenceDeep = (x, y) ->
	return _.filter(x, _.partial(_.negate(containsDeep), y))

createDiffOperation = (type, element) ->
	return {
		type: type
		drive: element
	}

###*
# @summary Detect changes regarding drives between different time intervals
# @function
# @protected
#
# @param {Array} - previous drive list
# @param {Array} - current drive list
# @returns {Object[]} - current drive list, potential differences with previous one
#
# @example
# compare(previousDrives, currentDrives)
###
module.exports = (previous, current) ->
	additions = differenceDeep(current, previous)
	removals = differenceDeep(previous, current)

	mappingAdditions = _.map(additions, _.partial(createDiffOperation, 'add'))
	mappingRemovals = _.map(removals, _.partial(createDiffOperation, 'remove'))

	return {
		drives: current
		diff: _.union(mappingAdditions, mappingRemovals)
	}
