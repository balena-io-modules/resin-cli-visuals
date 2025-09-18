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

import ansis from 'ansis';
import type { AdapterSourceDestination } from 'etcher-sdk/build/scanner/adapters';

const driveToChoice = function (drive: AdapterSourceDestination) {
	const size = drive.size! / 1000000000;

	return {
		name: `${drive.device} (${size.toFixed(1)} GB) - ${drive.description}`,
		value: drive.device,
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
export default async function (message: string) {
	message ??= 'Select a drive';
	const etcherSdkScanner = await import('etcher-sdk/build/scanner');
	const adapter = new etcherSdkScanner.adapters.BlockDeviceAdapter({});
	const scanner = new etcherSdkScanner.Scanner([adapter]);
	try {
		await scanner.start();
		const DynamicList = (await import('./dynamic-list')).default;
		const list = new DynamicList({
			message,
			emptyMessage: `${ansis.red('x')} No available drives were detected, plug one in!`,
			choices: Array.from(scanner.drives).map(driveToChoice),
		});

		scanner.on('attach', function (drive: AdapterSourceDestination) {
			list.addChoice(driveToChoice(drive));
			list.render();
		});
		scanner.on('detach', function (drive: AdapterSourceDestination) {
			list.removeChoice(driveToChoice(drive));
			list.render();
		});

		return list.run();
	} finally {
		scanner.stop();
	}
}
