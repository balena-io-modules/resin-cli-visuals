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

  Progress.prototype.tick = function(percentage, eta) {
    if (percentage == null) {
      throw new Error('Missing percentage');
    }
    if (eta == null) {
      throw new Error('Missing eta');
    }
    return _.template(this.format, {
      bar: this.bar.format(percentage / 100),
      percentage: Math.floor(percentage),
      eta: eta
    });
  };

  return Progress;

})();
