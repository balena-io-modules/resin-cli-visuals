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
    return async.reject(drives, drivelist.isSystem, function(removableDrives) {
      if (_.isEmpty(removableDrives)) {
        return callback(new Error('No available drives'));
      }
      removableDrives = _.map(removableDrives, function(item) {
        return {
          name: "" + item.device + " (" + item.size + ") - " + item.description,
          value: item.device
        };
      });
      return widgets.select('Select a drive', removableDrives, callback);
    });
  });
};

exports.confirm = function(yesOption, message, callback) {
  if (yesOption) {
    return callback(null, true);
  } else {
    return widgets.confirm(message, callback);
  }
};

exports.selectNetworkParameters = function(outerCallback) {
  var result;
  result = {};
  return async.waterfall([
    function(callback) {
      return widgets.select('Select a network type', ['ethernet', 'wifi'], function(error, networkType) {
        if (error != null) {
          return callback(error);
        }
        result.network = networkType;
        return callback();
      });
    }, function(callback) {
      if (result.network !== 'wifi') {
        return outerCallback(null, result);
      }
      return widgets.ask('What\'s your wifi ssid?', null, function(error, ssid) {
        if (error != null) {
          return callback(error);
        }
        result.wifiSsid = ssid;
        return callback();
      });
    }, function(callback) {
      return widgets.ask('What\'s your wifi key?', null, function(error, key) {
        if (error != null) {
          return callback(error);
        }
        result.wifiKey = key;
        return callback();
      });
    }, function(callback) {
      return callback(null, result);
    }
  ], outerCallback);
};
