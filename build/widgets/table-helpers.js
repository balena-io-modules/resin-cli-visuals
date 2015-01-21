var KEY_DISPLAY_MAP, isRealObject, isReallyEmpty, renameObjectKey, startsWithLetter, _;

_ = require('lodash');

_.str = require('underscore.string');

KEY_DISPLAY_MAP = {
  app_name: 'Name',
  last_seen_time: 'Last Seen',
  ip_address: 'IP Address',
  id: 'ID',
  uuid: 'UUID'
};

startsWithLetter = function(string) {
  var firstLetter;
  firstLetter = _.first(string);
  return /[a-z|A-Z]/.test(firstLetter);
};

renameObjectKey = function(object, key, newKey) {
  if (key === newKey) {
    return;
  }
  object[newKey] = object[key];
  return delete object[key];
};

exports.getKeyName = function(key) {
  var nameFromMap;
  nameFromMap = KEY_DISPLAY_MAP[key];
  if (nameFromMap != null) {
    return nameFromMap;
  }
  if (_.values(KEY_DISPLAY_MAP).indexOf(key) !== -1) {
    return key;
  }
  key = _.str.humanize(key);
  return _.str.titleize(key);
};

isReallyEmpty = function(value) {
  if (_.isNumber(value) || _.isBoolean(value)) {
    return false;
  }
  return _.isEmpty(value);
};

exports.prepareObject = function(object) {
  var key, newKeyName, value;
  object = _.omit(object, function(value, key) {
    return !startsWithLetter(key);
  });
  for (key in object) {
    value = object[key];
    if (_.isObject(value) && !_.isArray(value)) {
      object[key] = exports.prepareObject(value);
    }
    newKeyName = exports.getKeyName(key);
    renameObjectKey(object, key, newKeyName);
  }
  object = _.omit(object, function(value, key) {
    return isReallyEmpty(value);
  });
  return object;
};

exports.processTableContents = function(contents) {
  if (contents == null) {
    return;
  }
  if (!_.isArray(contents)) {
    contents = [contents];
  }
  return _.map(contents, exports.prepareObject);
};

isRealObject = function(object) {
  if (_.isArray(object) || _.isFunction(object)) {
    return false;
  }
  return _.isObject(object);
};

exports.getDefaultContentsOrdering = function(contents) {
  var firstContentEntry;
  if (_.isEmpty(contents)) {
    return;
  }
  firstContentEntry = _.first(contents);
  if (!isRealObject(firstContentEntry)) {
    return;
  }
  return _.keys(firstContentEntry);
};

exports.normaliseOrdering = function(ordering, contents) {
  if (!_.isEmpty(ordering)) {
    return _.map(ordering, exports.getKeyName);
  }
  return exports.getDefaultContentsOrdering(contents);
};
