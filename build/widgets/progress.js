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

  Progress.prototype.lines = [];

  Progress.prototype.tick = function(state) {
    var line;
    if (state.percentage == null) {
      throw new Error('Missing percentage');
    }
    if (state.eta == null) {
      throw new Error('Missing eta');
    }
    line = _.template(this.format, {
      bar: this.bar.format(state.percentage / 100),
      percentage: Math.floor(state.percentage),
      eta: state.eta
    });
    this.lines.push(line);
    return line;
  };

  Progress.prototype.update = function(state) {
    var bar;
    bar = '\r' + this.tick(state);
    return process.stdout.write(bar);
  };

  Progress.prototype.end = function() {
    return process.stdout.write('\n');
  };

  return Progress;

})();
