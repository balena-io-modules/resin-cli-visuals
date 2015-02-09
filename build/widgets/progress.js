var Progress, ProgressBarFormatter, _;

_ = require('lodash');

_.str = require('underscore.string');

ProgressBarFormatter = require('progress-bar-formatter');

module.exports = Progress = (function() {
  function Progress(message, size) {
    if (message == null) {
      throw new Error('Missing message');
    }
    this.bar = new ProgressBarFormatter({
      complete: '=',
      incomplete: ' ',
      length: size
    });
    this.format = "" + message + " [<%= bar %>] <%= percentage %>% eta <%= eta %>s";
  }

  Progress.prototype.tick = function(state) {
    if (state.percentage == null) {
      throw new Error('Missing percentage');
    }
    if (state.eta == null) {
      throw new Error('Missing eta');
    }
    this.lastLine = _.template(this.format, {
      bar: this.bar.format(state.percentage / 100),
      percentage: Math.floor(state.percentage),
      eta: state.eta
    });
    return this.lastLine;
  };

  Progress.prototype.eraseLastLine = function() {
    var eraser;
    if (this.lastLine == null) {
      return;
    }
    eraser = _.str.repeat(' ', this.lastLine.length);
    return process.stdout.write("\r" + eraser);
  };

  Progress.prototype.update = function(state) {
    var bar;
    this.eraseLastLine();
    bar = '\r' + this.tick(state);
    return process.stdout.write(bar);
  };

  Progress.prototype.end = function() {
    return process.stdout.write('\n');
  };

  return Progress;

})();
