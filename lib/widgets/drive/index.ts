/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
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

const ansis = require('ansis');
const Promise = require('bluebird');

const driveToChoice = function(drive) {
	const size = drive.size / 1000000000;

	return {
		name: `${drive.device} (${size.toFixed(1)} GB) - ${drive.description}`,
		value: drive.device
	};
};

/**
 * @summary Prompt the user to select a drive device
 * @name drive
 * @function
 * @public
 * @memberof visuals
 *
 * @description
 * The dropdown detects and autorefreshes itself when the drive list changes.
 *
 * @param {String} [message='Select a drive'] - message
 * @returns {Promise<String>} device path
 *
 * @example
 * visuals.drive('Please select a drive').then (drive) ->
 * 	console.log(drive)
 */
module.exports = function(message) {
	if (message == null) { message = 'Select a drive'; }
	let scanner = require('etcher-sdk/build/scanner');
	const adapter = new scanner.adapters.BlockDeviceAdapter({});
	scanner = new scanner.Scanner([adapter]);
	return Promise.resolve(scanner.start()).then(function() {
		const DynamicList = require('./dynamic-list').default;
		const list = new DynamicList({
			message,
			emptyMessage: `${ansis.red('x')} No available drives were detected, plug one in!`,
			choices: Array.from(scanner.drives).map(driveToChoice)
		});

		scanner.on('attach', function(drive) {
			list.addChoice(driveToChoice(drive));
			return list.render();
		});
		scanner.on('detach', function(drive) {
			list.removeChoice(driveToChoice(drive));
			return list.render();
		});

		return list.run();}).finally(() => scanner.stop());
};
