const assert = require('chai').assert;
const lib = require('../lib/displayLib.js');
const Item = require('../lib/toDoItem.js');


describe('toHtmlItemList', function(){
  it('should convert given item list to html format', function(){
    let item = new Item("Sleep");
    let expected = `<div id='Sleep'><li><input type='checkbox'></input>Sleep<button>Delete</button></li></div>`;
    assert.equal(lib.toItemList(item),expected)
    item.check();
    expected = `<div id='Sleep'><li><input type='checkbox' checked></input>Sleep<button>Delete</button></li></div>`;
    assert.equal(lib.toItemList(item),expected)
  });

});
