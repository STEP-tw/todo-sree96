const assert = require('chai').assert;
const lib = require('../lib/displayLib.js');
const Item = require('../lib/toDoItem.js');


describe('toHtmlItemList', function(){
  it('should convert given item list to html format', function(){
    let item = new Item("Sleep");
    let expected = `<li><input type='checkbox' id='Sleep'></input>Sleep<button id='Sleep'>Delete</button></li>`;
    assert.equal(lib.toItemList(item),expected)
    item.check();
    expected = `<li><input type='checkbox' id='Sleep' checked></input>Sleep<button id='Sleep'>Delete</button></li>`;
    assert.equal(lib.toItemList(item),expected)
  });

});
