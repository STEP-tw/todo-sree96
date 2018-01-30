const utils = require('../utils.js');
const assert = require('chai').assert;
describe('Utils Test', function(){
  it('#sessionidGenerator()', function(){
    assert.isNumber(utils.sessionidGenerator());
  });
});
