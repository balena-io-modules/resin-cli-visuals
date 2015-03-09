var inquirer, _;

_ = require('lodash');

inquirer = require('inquirer');

exports.table = require('./table');

exports.Progress = require('./progress');

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

exports.select = function(message, list, callback) {
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

exports.confirmRemoval = function(name, callback) {
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
};

exports.confirm = function(message, callback) {
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
};

exports.ask = function(question, defaultValue, callback) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      message: question,
      "default": defaultValue,
      validate: function(input) {
        return _.isString(input) && !_.isEmpty(input);
      }
    }
  ], function(response) {
    return callback(null, response.answer);
  });
};
