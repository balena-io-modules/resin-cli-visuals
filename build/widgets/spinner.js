
/*
The MIT License

Copyright (c) 2015 Resin.io, Inc. https://resin.io.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
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
