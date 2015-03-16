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
  }

  Spinner.prototype.start = function() {
    return this.spinner.start();
  };

  Spinner.prototype.stop = function() {
    return this.spinner.stop(true);
  };

  return Spinner;

})();
