var ask, async, drivelist, inquirer, resin, select, _;

_ = require('lodash');

drivelist = require('drivelist');

async = require('async');

resin = require('resin-sdk');

inquirer = require('inquirer');

exports.register = function(callback) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Email'
    }, {
      type: 'input',
      name: 'username',
      message: 'Username'
    }, {
      type: 'password',
      name: 'password',
      message: 'Password',
      validate: function(input) {
        if (input.length < 8) {
          return 'Password should be 8 characters long';
        }
        return true;
      }
    }
  ], _.partial(callback, null));
};

exports.login = function(callback) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Username'
    }, {
      type: 'password',
      name: 'password',
      message: 'Password'
    }
  ], _.partial(callback, null));
};

exports.remove = function(name, confirmAttribute, deleteFunction, outerCallback) {
  return async.waterfall([
    function(callback) {
      if (confirmAttribute) {
        return callback(null, true);
      }
      return inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: "Are you sure you want to delete the " + name + "?",
          "default": false
        }
      ], function(response) {
        return callback(null, response.confirmed);
      });
    }, function(confirmed, callback) {
      if (!confirmed) {
        return callback();
      }
      return deleteFunction(callback);
    }
  ], outerCallback);
};

select = function(message, list, callback) {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: message || 'Select an option',
      choices: list
    }
  ], function(response) {
    return callback(null, response.option);
  });
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
      return select('Select a drive', removableDrives, callback);
    });
  });
};

exports.confirm = function(yesOption, message, callback) {
  if (yesOption) {
    return callback(null, true);
  } else {
    return inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: message,
        "default": false
      }
    ], function(response) {
      return callback(null, response.confirmed);
    });
  }
};

ask = function(message, callback) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      message: message,
      validate: function(input) {
        return _.isString(input) && !_.isEmpty(input);
      }
    }
  ], function(response) {
    return callback(null, response.answer);
  });
};

exports.selectNetworkParameters = function(outerCallback) {
  var result;
  result = {};
  return async.waterfall([
    function(callback) {
      return select('Select a network type', ['ethernet', 'wifi'], function(error, networkType) {
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
      return ask('What\'s your wifi ssid?', function(error, ssid) {
        if (error != null) {
          return callback(error);
        }
        result.wifiSsid = ssid;
        return callback();
      });
    }, function(callback) {
      return ask('What\'s your wifi key?', function(error, key) {
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

exports.selectDeviceType = function(callback) {
  return resin.models.device.getSupportedDeviceTypes(function(error, deviceTypes) {
    if (error != null) {
      return callback(error);
    }
    return select('Select a type', deviceTypes, callback);
  });
};

exports.loginWithToken = function(callback) {
  return ask('What\'s your token? (visible in the preferences page)', callback);
};
