let chai = require('chai');
let assert = chai.assert;
let TodoItem=require('../models/todoItem.js');
let todoItem={};
describe('TodoItem', function(){
  beforeEach(function(){
    todoItem=new TodoItem("tea");
  });
  describe('new TodoItem', function(){
    it('should create a new todoItem with status false', function(){
      assert.deepEqual(todoItem,{'item':'tea','status':false});
    });
  });
  describe('#editItem()', function(){
    it('editItem function should edit the item', function(){
      assert.deepEqual(todoItem,{'item':'tea','status':false});
      todoItem.editItem('coffee');
      assert.deepEqual(todoItem,{'item':'coffee','status':false});
    });
  });
  describe('#getItem()', function(){
    it('getItem function should return the current item', function(){
      assert.deepEqual(todoItem.getItem(),'tea');
      todoItem.editItem('coffee');
      assert.deepEqual(todoItem.getItem(),'coffee');
    });
  });
  describe('#isDone()', function(){
    it('isDone function should return the current status of item', function(){
      assert.deepEqual(todoItem.isDone(),false);
    });
  });
  describe('#check()', function(){
    it('check function should set the status of item to true', function(){
      assert.deepEqual(todoItem,{'item':'tea','status':false});
      todoItem.check();
      assert.deepEqual(todoItem,{'item':'tea','status':true});
    });
  });

  describe('#uncheck()', function(){
    it('uncheck function should set the status of item to false', function(){
      assert.deepEqual(todoItem,{'item':'tea','status':false});
      todoItem.check();
      assert.deepEqual(todoItem,{'item':'tea','status':true});
      todoItem.uncheck();
      assert.deepEqual(todoItem,{'item':'tea','status':false});
    });
  });
});
