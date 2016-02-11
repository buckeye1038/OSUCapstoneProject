var PreAnalyzer = require('../app/PreAnalyzer.js');
var assert = require('assert');

describe('PreAnalyzer', function() {
  describe('#add()', function() {
    it('should add 1 to PreAnalyzer.num', function() {
      var preAnalyzer = new PreAnalyzer(1);
      preAnalyzer.add(1);
      assert.equal(2, preAnalyzer.num);
    })
  });
  describe('#add()', function() {
    it('should return 1 when 1 is subtracted from 2', function() {
      var result = PreAnalyzer.subtract(2, 1);
      assert.equal(1, result);
    })
  });
});
