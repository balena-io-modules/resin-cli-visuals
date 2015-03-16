var CliSpinner, Spinner;

CliSpinner = require('cli-spinner').Spinner;

module.exports = Spinner = (function() {
  function Spinner(message) {
    if (message == null) {
      throw new Error('Missing message');
    }
    this.message = "%s " + message;
    this.spinner = new CliSpinner(this.message);
    this.spinner.setSpinnerString('|/-\\');
    this.running = false;
  }

  Spinner.prototype.isRunning = function() {
    return this.running;
  };

  Spinner.prototype.start = function() {
    if (this.isRunning()) {
      return;
    }
    this.spinner.start();
    return this.running = true;
  };

  Spinner.prototype.stop = function() {
    if (!this.isRunning()) {
      return;
    }
    this.spinner.stop(true);
    return this.running = false;
  };

  return Spinner;

})();
