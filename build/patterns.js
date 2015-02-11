var async, drivelist, resin, widgets, _;

_ = require('lodash');

drivelist = require('drivelist');

async = require('async');

resin = require('resin-sdk');

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

exports.selectDrive = function(callback) {
  return drivelist.list(function(error, drives) {
    if (error != null) {
      return callback(error);
    }
    drives = _.map(drives, function(item) {
      return {
        name: "" + item.device + " (" + item.size + ") - " + item.description,
        value: item.device
      };
    });
    return widgets.select('Select a drive', drives, callback);
  });
};

exports.selectDeviceType = function(callback) {
  return resin.models.device.getSupportedDeviceTypes(function(error, deviceTypes) {
    if (error != null) {
      return callback(error);
    }
    return widgets.select('Select a type', deviceTypes, callback);
  });
};

exports.confirm = function(yesOption, message, callback) {
  if (yesOption) {
    return callback(null, true);
  } else {
    return widgets.confirm(message, callback);
  }
};
