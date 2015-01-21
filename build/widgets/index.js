var Progress, ProgressBar, inquirer, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

inquirer = require('inquirer');

ProgressBar = require('progress');

exports.table = require('./table');

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

exports.ask = function(question, callback) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      message: question,
      validate: function(input) {
        return _.isString(input) && !_.isEmpty(input);
      }
    }
  ], function(response) {
    return callback(null, response.answer);
  });
};

exports.Progress = Progress = (function(_super) {
  __extends(Progress, _super);

  function Progress(message, size) {
    var options;
    message = "" + message + " [:bar] :percent :etas";
    options = {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: size
    };
    Progress.__super__.constructor.call(this, message, options);
  }

  return Progress;

})(ProgressBar);
