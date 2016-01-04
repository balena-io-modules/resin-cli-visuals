
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
var CliSpinner, Spinner, _;

_ = require('lodash');

_.str = require('underscore.string');

CliSpinner = require('cli-spinner').Spinner;

module.exports = Spinner = (function() {

  /**
  	 * @summary Create a CLI Spinner
  	 * @name Spinner
  	 * @class
  	 * @public
  	 * @memberof visuals
  	 *
  	 * @param {String} message - message
  	 * @returns {Spinner} spinner instance
  	 *
  	 * @throws Will throw if no message.
  	 *
  	 * @example
  	 * spinner = new visuals.Spinner('Hello World')
   */
  function Spinner(message) {
    if (_.str.isBlank(message)) {
      throw new Error('Missing message');
    }
    this.spinner = new CliSpinner("%s " + message);
    this.spinner.setSpinnerString('|/-\\');
    this.spinner.setSpinnerDelay(60);
    this.started = false;
  }


  /**
  	 * @summary Start the spinner
  	 * @name visuals.Spinner#start
  	 * @method
  	 * @public
  	 *
  	 * @example
  	 * spinner = new visuals.Spinner('Hello World')
  	 * spinner.start()
   */

  Spinner.prototype.start = function() {
    if (this.started) {
      return;
    }
    this.spinner.start();
    return this.started = true;
  };


  /**
  	 * @summary Stop the spinner
  	 * @name visuals.Spinner#stop
  	 * @method
  	 * @public
  	 *
  	 * @example
  	 * spinner = new visuals.Spinner('Hello World')
  	 * spinner.stop()
   */

  Spinner.prototype.stop = function() {
    if (!this.started) {
      return;
    }
    this.spinner.stop(true);
    return this.started = false;
  };

  return Spinner;

})();
