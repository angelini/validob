var TYPES = [Date, String, Number, Buffer];

var _ = require('underscore');

var testDefaultType = function(rule, elem) {
  if(rule === Date) {
    return _.isDate(elem);
  }

  if(rule === String) {
    return _.isString(elem);
  }

  if(rule === Number) {
    return _.isNumber(elem);
  }

  if(rule === Buffer) {
    return Buffer.isBuffer(elem);
  }
};

var check = function(rule, elem) {
  if(_.isArray(rule)) {
    if(_.isEmpty(rule)) {
      return false;
    }

    rule = rule[0];
  }

  if(TYPES.indexOf(rule) !== -1) {
    return testDefaultType(rule, elem);
  }

  if(_.isFunction(rule)) {
    return rule(elem);
  }
};

var Schema = exports.Schema = function(rules) {
  this.rules = rules;
};

Schema.prototype.validate = function(object) {
  var i;
  var response = {
    valid: true,
    missing: [],
    error: [],
    body: {}
  }

  for(i in this.rules) {
    if(this.rules.hasOwnProperty(i)) {
      var validation = this.rules[i];

      if(typeof validation != 'object') {
        validation = {
          rule: validation
        };
      }

      if(validation.required && !object[i]) {
        response.missing.push(i);
        response.valid = false;
        continue;
      }

      if(!check(validation.rule, object[i])) {
        response.error.push(i);
        response.valid = false;
        continue;
      }

      response.body[i] = object[i];
    }
  }

  return response;
};

