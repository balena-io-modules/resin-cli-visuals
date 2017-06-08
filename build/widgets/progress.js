
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
var CARRIAGE_RETURN, Progress, ProgressBarFormatter, _, moment;

_ = require('lodash');

_.str = require('underscore.string');

moment = require('moment');

require('moment-duration-format');

ProgressBarFormatter = require('progress-bar-formatter');

CARRIAGE_RETURN = '\u001b[1A';

module.exports = Progress = (function() {

  /**
  	 * @summary Create a CLI Progress Bar
  	 * @name Progress
  	 * @class
  	 * @public
  	 * @memberof visuals
  	 *
  	 * @param {String} message - message
  	 * @returns {Progress} progress bar instance
  	 *
  	 * @throws Will throw if no message.
  	 *
  	 * @example
  	 * progress = new visuals.Progress('Hello World')
   */
  function Progress(message) {
    if (_.str.isBlank(message)) {
      throw new Error('Missing message');
    }
    this._message = message;
    this._bar = new ProgressBarFormatter({
      complete: '=',
      incomplete: ' ',
      length: 24
    });
  }


  /**
  	 * @summary Get progress string from a state
  	 * @name visuals.Progress#_tick
  	 * @method
  	 * @private
  	 *
  	 * @param {Object} state - progress state
  	 * @param {Number} state.percentage - percentage
  	 * @param {Number} state.eta - eta in seconds
  	 *
  	 * @throws Will throw if no percentage.
  	 * @throws Will throw if no eta.
  	 *
  	 * @returns {String} progress string
  	 *
  	 *	@example
  	 * progress = new visuals.Progress('Hello World')
  	 * string = progress._tick(percentage: 49, eta: 300)
  	 * console.log(string)
   */

  Progress.prototype._tick = function(state) {
    var bar, percentage;
    if (state.percentage == null) {
      throw new Error('Missing percentage');
    }
    bar = this._bar.format(state.percentage / 100);
    percentage = Math.floor(state.percentage);
    this._lastLine = this._message + " [" + bar + "] " + percentage + "%";
    if (state.eta != null) {
      this._lastLine += " eta " + (moment.duration(state.eta, 'seconds').format('m[m]ss[s]'));
    }
    return this._lastLine;
  };


  /**
  	 * @summary Erase last printed line
  	 * @name visuals.Progress#_eraseLastLine
  	 * @method
  	 * @private
  	 *
  	 * @example
  	 * progress = new visuals.Progress('Hello World')
  	 * progress._eraseLastLine()
   */

  Progress.prototype._eraseLastLine = function() {
    var eraser;
    if (this._lastLine == null) {
      process.stdout.write('\n');
      return;
    }
    eraser = _.str.repeat(' ', this._lastLine.length);
    return console.log(CARRIAGE_RETURN + eraser);
  };


  /**
  	 * @summary Update the progress bar
  	 * @name visuals.Progress#update
  	 * @method
  	 * @public
  	 *
  	 * @param {Object} state - progress state
  	 * @param {Number} state.percentage - percentage
  	 * @param {Number} state.eta - eta in seconds
  	 *
  	 * @example
  	 * progress = new visuals.Progress('Hello World')
  	 * progress.update(percentage: 49, eta: 300)
   */

  Progress.prototype.update = function(state) {
    this._eraseLastLine();
    return console.log(CARRIAGE_RETURN + this._tick(state));
  };

  return Progress;

})();
