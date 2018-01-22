const assert = require('chai').assert;
const lib = require('../lib/displayLib.js');

describe('toHtmlItemList', function(){
  it('should convert given item list to html format', function(){
    let item = "Item 1"
    let expected = `<li id="Item 1"><input type='checkbox'></input>Item 1<button id="Item 1">Delete</button></li>`;
    assert.equal(lib.toItemList(item),expected)
  });

});
