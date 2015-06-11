var inquirer, _;

_ = require('lodash');

inquirer = require('inquirer');


/**
 * @summary Translate a form description to inquirer questions
 * @function
 * @private
 *
 * @param {Object[]} form - form description
 * @returns {Object[]} inquirer questions
 *
 * @todo This is a work in progress and only necessary input types are supported.
 *
 * @example
 * questions = visuals.form.parse [
 *		label: 'Processor'
 *		name: 'processorType'
 *		type: 'select'
 *		values: [ 'Z7010', 'Z7020' ]
 *	,
 *		label: 'Coprocessor cores'
 *		name: 'coprocessorCore'
 *		type: 'select'
 *		values: [ '16', '64' ]
 *	,
 *		label: 'HDMI'
 *		name: 'hdmi'
 *		type: 'checkbox'
 *		value: 1
 * ]
 */

exports.parse = function(form) {
  return _.map(form, function(option) {
    var key, result, value;
    result = {
      message: option.label,
      name: option.name,
      validate: option.validate
    };
    if (!_.isEmpty(option.when)) {
      result.when = function(answers) {
        if (answers == null) {
          return false;
        }
        return _.findWhere([answers], option.when) != null;
      };
    }
    if (option.type === 'select') {
      result.type = 'list';
      result.choices = option.values;
    } else if (option.type === 'checkbox') {
      result.type = 'confirm';
      result["default"] = !!option.value;
    } else if (option.type === 'text') {
      result.type = 'input';
      result["default"] = option.value;
    } else if (option.type === 'password') {
      result.type = 'password';
    } else {
      throw new Error("Unsupported option type: " + option.type);
    }
    for (key in result) {
      value = result[key];
      if (value == null) {
        delete result[key];
      }
    }
    return result;
  });
};


/**
 * @summary Run a form description
 * @function
 * @public
 *
 * @param {Object[]} form - form description
 * @param {Function} callback - callback (error, answers)
 *
 * @example
 * visuals.form.run [
 *		label: 'Processor'
 *		name: 'processorType'
 *		type: 'select'
 *		values: [ 'Z7010', 'Z7020' ]
 *	,
 *		label: 'Coprocessor cores'
 *		name: 'coprocessorCore'
 *		type: 'select'
 *		values: [ '16', '64' ]
 *	,
 *		label: 'HDMI'
 *		name: 'hdmi'
 *		type: 'checkbox'
 *		value: 1
 * ], (error, answers) ->
 *		throw error if error?
 *		console.log(answers)
 */

exports.run = function(form, callback) {
  return inquirer.prompt(exports.parse(form), _.partial(callback, null));
};


/**
 * @summary Run a single form question
 * @function
 * @public
 *
 * @param {Object} question - form question
 * @param {Function} callback - callback (error, answer)
 *
 * @example
 * visuals.form.ask
 *		label: 'Processor'
 *		type: 'select'
 *		values: [ 'Z7010', 'Z7020' ]
 * , (error, answer) ->
 *		throw error if error?
 *		console.log(answer)
 */

exports.ask = function(question, callback) {
  if (question.name == null) {
    question.name = 'question';
  }
  return exports.run([question], function(error, answers) {
    if (error != null) {
      return callback(error);
    }
    return callback(null, answers[question.name]);
  });
};
