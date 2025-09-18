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
import Spinner from './spinner';

import isPromise from 'is-promise';

export interface SpinnerPromiseOptions<T> {
	promise: Promise<T>;
	startMessage: string;
	stopMessage?: string;
}

/**
 * @summary Create a CLI Spinner that spins on a promise
 * @name SpinnerPromise
 * @public
 * @memberof visuals
 *
 * @description
 * This function will start a Spinner and stop it when the
 * passed promise is either fulfilled or rejected. The function
 * returns the passed promise which will be in either rejected or
 * resolved state.
 *
 * @param {Object} options - spinner promise options
 * @param {Promise} options.promise - promise to spin upon
 * @param {String} options.startMessage - start spinner message
 * @param {String} options.stopMessage - stop spinner message
 * @fulfil {Object} value - resolved or rejected promise
 * @returns {Promise}
 *
 * @example
 *  visuals.SpinnerPromise
 *		 promise: scanDevicesPromise
 *		 startMessage: "Scanning devices"
 *		 stopMessage: "Scanned devices"
 *  .then (devices) ->
 *		 console.log devices
 */
export const createSpinnerPromise = async function <T>(
	options: SpinnerPromiseOptions<T>,
): Promise<T> {
	if (options == null || !isPromise(options.promise)) {
		throw new Error("'promise' must be a Promises/A+ compatible promise");
	}

	if (_.trim(options.startMessage) === '') {
		throw new Error('Missing spinner start message');
	}

	const { promise, startMessage, stopMessage } = options;

	const spinner = new Spinner(startMessage);
	spinner.start();
	const clearSpinner = () => {
		spinner.stop();
		if (stopMessage != null) {
			console.log(stopMessage);
		}
		return promise;
	};
	return await promise.then(clearSpinner, clearSpinner);
};
