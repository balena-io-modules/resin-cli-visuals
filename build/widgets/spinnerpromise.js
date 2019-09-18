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
var Spinner, SpinnerPromise, _, isPromise;

_ = require('lodash');

_.str = require('underscore.string');

Spinner = require('./spinner');

isPromise = require('is-promise');

module.exports = SpinnerPromise = class SpinnerPromise {
  /**
   * @summary Create a CLI Spinner that spins on a promise
   * @name SpinnerPromise
   * @class
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
  constructor(options = {}, stream = process.stdout) {
    var clearSpinner, promise, startMessage, stopMessage;
    ({promise, startMessage, stopMessage} = options);
    if (!isPromise(promise)) {
      return Promise.reject(new Error("'promise' must be a Promises/A+ compatible promise"));
    }
    if (_.str.isBlank(startMessage)) {
      return Promise.reject(new Error('Missing spinner start message'));
    }
    clearSpinner = () => {
      var ref;
      if ((ref = this.spinner) != null) {
        ref.stop();
      }
      if (stopMessage != null) {
        console.log(stopMessage);
      }
      return promise;
    };
    this.spinner = new Spinner(startMessage, stream);
    this.spinner.start();
    return promise.then(clearSpinner, clearSpinner);
  }

};
