
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
    this._bar = new ProgressBarFormatter({
      complete: '=',
      incomplete: ' ',
      length: 24
    });
    this._format = message + " [<%= bar %>] <%= percentage %>% eta <%= eta %>";
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
    var data;
    if (state.percentage == null) {
      throw new Error('Missing percentage');
    }
    data = {
      bar: this._bar.format(state.percentage / 100),
      percentage: Math.floor(state.percentage),
      eta: moment.duration(state.eta || 0, 'seconds').format('m[m]ss[s]')
    };
    this._lastLine = _.template(this._format)(data);
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
