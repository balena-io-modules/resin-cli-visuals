var async, widgets;

async = require('async');

widgets = require('./widgets');

exports.remove = function(name, confirmAttribute, deleteFunction, outerCallback) {
  return async.waterfall([
    function(callback) {
      if (confirmAttribute) {
        return callback(null, true);
      }
      return widgets.confirmRemoval(name, callback);
    }, function(confirmed, callback) {
      if (!confirmed) {
        return callback();
      }
      return deleteFunction(callback);
    }
  ], outerCallback);
};
