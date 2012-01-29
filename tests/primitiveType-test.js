var vows = require('vows');
var assert = require('assert');

var validob = require('../lib/validob');

var Test = new validob.Schema({
  date: {
    rule: Date,
    required: true
  },
  string: String,
  number: Number,
  buffer: Buffer
});

vows.describe('Primitive Types').addBatch({
  'Valid primitive types': {
    topic: function() {
      return Test.validate({
        date: new Date(),
        string: "hello",
        number: 123,
        buffer: new Buffer(5)
      });
    },

    'should be valid': function(validation) {
      assert(validation.valid);
    },

    'should have no errors': function(validation) {
      assert.equal(validation.missing.length, 0);
      assert.equal(validation.error.length, 0);
    }
  },

  'Invalid primitive types': {
    topic: function() {
      return Test.validate({
        date: "12-01-03",
        string: 43770,
        number: "1234",
        buffer: 123
      });
    },

    'should not be valid': function(validation) {
      assert.equal(validation.valid, false);
    },

    'every property should be an error': function(validation) {
      assert.equal(validation.missing.length, 0);
      assert.equal(validation.error.length, 4);
    }
  },

  'Missing required type': {
    topic: function() {
      return Test.validate({});
    },

    'should be invalid': function(validation) {
      assert.equal(validation.valid, false);
    },

    'should be missing the required date field': function(validation) {
      assert.equal(validation.missing.length, 1);
      assert.equal(validation.error.length, 3);
    }
  }
})['export'](module);

