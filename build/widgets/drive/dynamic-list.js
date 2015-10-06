
/*
The MIT License

Copyright (c) 2015 Resin.io, Inc. https://resin.io.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
var DynamicList, InquirerList, Promise, UI, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

Promise = require('bluebird');

InquirerList = require('inquirer/lib/prompts/list');

UI = require('inquirer/lib/ui/baseUI');

module.exports = DynamicList = (function(superClass) {
  extend(DynamicList, superClass);


  /**
  	 * @summary Dynamic list widget
  	 * @class
  	 * @protected
  	 *
  	 * @param {Object} [options] - options
  	 * @param {Object[]} options.choices - initial choices
  	 * @param {String} options.message - widget message
  	 * @param {String} options.emptyMessage - message for when no choices
  	 *
  	 * @example
  	 * list = new DynamicList
  	 * 	message: 'Foo'
  	 * 	emptyMessage: 'Nothing to show'
  	 * 	choices: [
  	 * 		name: 'Foo'
  	 * 		value: 'foo'
  	 * 	]
   */

  function DynamicList(options) {
    var base;
    this.options = options;
    if ((base = this.options).name == null) {
      base.name = 'dynamic-list';
    }
    this.ui = new UI({
      input: process.stdin,
      output: process.stdout
    });
    DynamicList.__super__.constructor.call(this, this.options, this.ui.rl);
  }


  /**
  	 * @summary Check if the list is empty
  	 * @method
  	 * @private
  	 *
  	 * @returns {Boolean} whether is empty
  	 *
  	 * @example
  	 * list = new DynamicList
  	 * 	message: 'Foo'
  	 * 	emptyMessage: 'Nothing to show'
  	 * 	choices: [
  	 * 		name: 'Foo'
  	 * 		value: 'foo'
  	 * 	]
  	 *
  	 * if list.isEmpty()
  	 * 	console.log('The list is empty')
   */

  DynamicList.prototype.isEmpty = function() {
    return this.opt.choices.length === 0;
  };


  /**
  	 * @summary Event listener for when a choice is selected
  	 * @method
  	 * @private
   */

  DynamicList.prototype.onSubmit = function() {
    if (this.isEmpty()) {
      return;
    }
    return DynamicList.__super__.onSubmit.apply(this, arguments);
  };


  /**
  	 * @summary Render the list
  	 * @method
  	 * @public
  	 *
  	 * @example
  	 * list = new DynamicList
  	 * 	message: 'Foo'
  	 * 	emptyMessage: 'Nothing to show'
  	 * 	choices: [
  	 * 		name: 'Foo'
  	 * 		value: 'foo'
  	 * 	]
  	 *
  	 * list.render()
   */

  DynamicList.prototype.render = function() {
    if (this.isEmpty()) {
      return this.screen.render(this.options.emptyMessage);
    }
    return DynamicList.__super__.render.apply(this, arguments);
  };


  /**
  	 * @summary Add a choice
  	 * @method
  	 * @public
  	 *
  	 * @param {Object} choice - choice
  	 *
  	 * @example
  	 * list = new DynamicList
  	 * 	message: 'Foo'
  	 * 	emptyMessage: 'Nothing to show'
  	 * 	choices: [
  	 * 		name: 'Foo'
  	 * 		value: 'foo'
  	 * 	]
  	 *
  	 * list.addChoice(name: 'Bar', value: 'bar')
  	 * list.render()
   */

  DynamicList.prototype.addChoice = function(choice) {
    return this.opt.choices.push(choice);
  };


  /**
  	 * @summary Remove a choice
  	 * @method
  	 * @public
  	 *
  	 * @param {Object} choice - choice
  	 *
  	 * @example
  	 * list = new DynamicList
  	 * 	message: 'Foo'
  	 * 	emptyMessage: 'Nothing to show'
  	 * 	choices: [
  	 * 		name: 'Foo'
  	 * 		value: 'foo'
  	 * 	]
  	 *
  	 * list.removeChoice(name: 'Foo', value: 'foo')
  	 * list.render()
   */

  DynamicList.prototype.removeChoice = function(choice) {
    var cleanupList;
    cleanupList = function(list, choice) {
      return _.reject(list, function(item) {
        return _.isEqual(_.pick(item, 'name', 'value'), choice);
      });
    };
    this.opt.choices.choices = cleanupList(this.opt.choices.choices, choice);
    return this.opt.choices.realChoices = cleanupList(this.opt.choices.realChoices, choice);
  };


  /**
  	 * @summary Run the widget
  	 * @method
  	 * @public
  	 *
  	 * @fulfil {String} answer
  	 * @returns {Promise}
  	 *
  	 * @example
  	 * list = new DynamicList
  	 * 	message: 'Foo'
  	 * 	emptyMessage: 'Nothing to show'
  	 * 	choices: [
  	 * 		name: 'Foo'
  	 * 		value: 'foo'
  	 * 	]
  	 *
  	 * list.run().then (answer) ->
  	 * 	console.log(answer)
   */

  DynamicList.prototype.run = function() {
    return Promise.fromNode((function(_this) {
      return function(callback) {
        return DynamicList.__super__.run.call(_this, function(answers) {
          _this.ui.close();
          return callback(null, answers);
        });
      };
    })(this));
  };

  return DynamicList;

})(InquirerList);
