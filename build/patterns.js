var async, drivelist, form, resin, _;

_ = require('lodash');

drivelist = require('drivelist');

async = require('async');

resin = require('resin-sdk');

form = require('./form');


/**
 * @summary Ask for registration details
 * @function
 * @public
 *
 * @param {Function} callback - callback (error, answers)
 *
 * @example
 * visuals.patterns.register (error, answers) ->
 *		throw error if error?
 *
 *		console.log(answers.email)
 *		console.log(answers.username)
 *		console.log(answers.password)
 */

exports.register = function(callback) {
  return form.run([
    {
      label: 'Email',
      name: 'email',
      type: 'text'
    }, {
      label: 'Username',
      name: 'username',
      type: 'text'
    }, {
      label: 'Password',
      name: 'password',
      type: 'password',
      validate: function(input) {
        if (input.length < 8) {
          return 'Password should be 8 characters long';
        }
        return true;
      }
    }
  ], callback);
};


/**
 * @summary Ask for login credentials
 * @function
 * @public
 *
 * @param {Function} callback - callback (error, answers)
 *
 * @example
 * visuals.patterns.login (error, answers) ->
 *		throw error if error?
 *
 *		console.log(answers.username)
 *		console.log(answers.password)
 */

exports.login = function(callback) {
  return form.run([
    {
      label: 'Username',
      name: 'username',
      type: 'text'
    }, {
      label: 'Password',
      name: 'password',
      type: 'password',
      validate: function(input) {
        if (input.length < 8) {
          return 'Password should be 8 characters long';
        }
        return true;
      }
    }
  ], callback);
};


/**
 * @summary Ask for login token
 * @function
 * @public
 *
 * @param {Function} callback - callback (error, token)
 *
 * @example
 * visuals.patterns.loginWithToken (error, token) ->
 *		throw error if error?
 *
 *		console.log(token)
 */

exports.loginWithToken = function(callback) {
  return form.ask({
    label: 'What\'s your token? (visible in the preferences page)',
    name: 'token',
    type: 'text'
  }, callback);
};


/**
 * @summary Prompt for confirmation
 * @function
 * @public
 *
 * @param {Boolean} yesOption - will prompt interactively if false
 * @param {String} message - confirmation message
 * @param {Function} callback - callback (error, answer)
 *
 * @example
 * visuals.patterns.confirm false, 'Are you sure?', (error, answer) ->
 *		throw error if error?
 *
 *		if answer
 *			console.log('Yes, sure!')
 *		else
 *			console.log('You don\'t look so convinced!')
 */

exports.confirm = function(yesOption, message, callback) {
  if (yesOption) {
    return callback(null, true);
  } else {
    return form.ask({
      label: message,
      type: 'checkbox',
      name: 'confirm',
      value: false
    }, callback);
  }
};


/**
 * @summary Prompt for removal
 * @function
 * @public
 *
 * @param {String} name - resource name to remove
 * @param {Boolean} confirmAttribute - confirm attribute
 * @param {Function} deleteFunction - the function to perform the deletion (callback)
 * @param {Function} callback - callback (error)
 *
 * @example
 * visuals.patterns.remove 'application', false, (callback) ->
 *		console.log('Removing application')
 *		return callback()
 *	, (error) ->
 *		throw error if error?
 *		console.log('The application was removed')
 */

exports.remove = function(name, confirmAttribute, deleteFunction, callback) {
  return async.waterfall([
    function(callback) {
      return exports.confirm(confirmAttribute, "Are you sure you want to delete the " + name + "?", callback);
    }, function(confirmed, callback) {
      if (!confirmed) {
        return callback();
      }
      return deleteFunction(callback);
    }
  ], callback);
};


/**
 * @summary Ask for a drive
 * @function
 * @public
 *
 * @param {Function} callback - callback (error, drive)
 *
 * @example
 * visuals.patterns.selectDrive (error, drive) ->
 *		throw error if error?
 *
 *		console.log(drive)
 */

exports.selectDrive = function(callback) {
  return drivelist.list(function(error, drives) {
    if (error != null) {
      return callback(error);
    }
    return async.reject(drives, drivelist.isSystem, function(removableDrives) {
      if (_.isEmpty(removableDrives)) {
        return callback(new Error('No available drives'));
      }
      return form.ask({
        label: 'Drive',
        name: 'drive',
        type: 'select',
        values: _.map(removableDrives, function(item) {
          return {
            name: "" + item.device + " (" + item.size + ") - " + item.description,
            value: item.device
          };
        })
      }, callback);
    });
  });
};


/**
 * @summary Ask for network parameters
 * @function
 * @public
 *
 * @param {Function} callback - callback (error, answers)
 *
 * @example
 * visuals.patterns.selectNetworkParameters (error, answers) ->
 *		throw error if error?
 *
 *		console.log(answers.network)
 *
 *		if answers.network is 'wifi'
 *			console.log(answers.wifiSsid)
 *			console.log(answers.wifiKey)
 */

exports.selectNetworkParameters = function(callback) {
  return form.run([
    {
      label: 'Network Type',
      name: 'network',
      type: 'select',
      values: ['ethernet', 'wifi']
    }, {
      label: 'Wifi Ssid',
      name: 'wifiSsid',
      type: 'text',
      when: {
        network: 'wifi'
      }
    }, {
      label: 'Wifi Key',
      name: 'wifiKey',
      type: 'text',
      when: {
        network: 'wifi'
      }
    }
  ], callback);
};


/**
 * @summary Ask for a device type
 * @function
 * @public
 *
 * @param {Function} callback - callback (error, deviceType)
 *
 * @example
 * visuals.patterns.selectDeviceType (error, deviceType) ->
 *		throw error if error?
 *
 *		console.log(deviceType)
 */

exports.selectDeviceType = function(callback) {
  return resin.models.device.getSupportedDeviceTypes(function(error, deviceTypes) {
    if (error != null) {
      return callback(error);
    }
    return form.ask({
      label: 'Device Type',
      name: 'deviceType',
      type: 'select',
      values: deviceTypes
    }, callback);
  });
};
