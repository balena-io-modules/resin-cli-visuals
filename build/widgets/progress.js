var Progress, ProgressBarFormatter, _;

_ = require('lodash');

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
    return _.template(this.format, {
      bar: this.bar.format(state.percentage / 100),
      percentage: Math.floor(state.percentage),
      eta: state.eta
    });
  };

  return Progress;

})();
