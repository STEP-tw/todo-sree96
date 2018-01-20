let assert = require('chai').assert;
let ToDoItem = require('../lib/toDoItem.js');

describe('ToDoItem Module',()=>{
  describe('editDesc',()=>{
    it('should edit description of ToDoItem',()=>{
      let toDoItem = new ToDoItem('Do Work');
      toDoItem.editDesc('Do_Work');
      assert.equal(toDoItem.getDesc(),'Do_Work');
    })
  })

  describe('check',()=>{
    it('should set checkedValue to true',()=>{
      let toDoItem = new ToDoItem('Do Work');
      toDoItem.check();
      assert.isOk(toDoItem.getCheckedValue());
    })
  })

  describe('uncheck',()=>{
    it('should set checkedValue to false',()=>{
      let toDoItem = new ToDoItem('Do Work');
      toDoItem.uncheck();
      assert.isNotOk(toDoItem.getCheckedValue());
    })
  })

  describe('getDesc',()=>{
    it('should give a toDoItem description',()=>{
      let toDoItem = new ToDoItem('Do Work');
      assert.equal(toDoItem.getDesc(),"Do Work");
      toDoItem.editDesc("Sleep")
      assert.equal(toDoItem.getDesc(),"Sleep");
    })
  })

  describe('getCheckedValue', function(){
    it('should return current checkedValue of Item', function(){
      let toDoItem = new ToDoItem('Do Work');
      assert.isNotOk(toDoItem.getCheckedValue());
      toDoItem.check();
      assert.isOk(toDoItem.getCheckedValue());
    });

  });

})
