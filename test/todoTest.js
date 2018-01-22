let assert = require('chai').assert;
let ToDo = require('../lib/toDo.js');
let ToDoItem = require('../lib/toDoItem.js');

describe('ToDo Module',()=>{
  describe('getTitle',()=>{
      it('should return title of ToDo',()=>{
        let todo = new ToDo('MyToDo');
        assert.equal(todo.getTitle(),'MyToDo');
      });
  });

  describe('editTitle',()=>{
    it('should edit title of ToDo',()=>{
      let todo = new ToDo('MyToDo');
      todo.editTitle('New ToDo');
      assert.equal(todo.getTitle(),'New ToDo');
    });
  });

  describe('getDescription',()=>{
      it('should return description of ToDo',()=>{
        let todo = new ToDo('MyToDo','desc');
        assert.equal(todo.getDesc(),'desc');
      });
  });

  describe('editDescription',()=>{
    it('should edit description of ToDo',()=>{
      let todo = new ToDo('My Description');
      todo.editDesc('New Description');
      assert.equal(todo.getDesc(),'New Description');
    });
  });

  describe('getItems', function(){
    it('should return allItems', function(){
      let expected = {'Item1':new ToDoItem('Item1'),'Item2':new ToDoItem('Item2')};
      let todo = new ToDo('Title');
      todo.addItem('Item1');
      todo.addItem('Item2');
      assert.deepEqual(todo.getItems(),expected);
    });
  });

  describe('getItemByDesc',()=>{
    it('should return the toDoItem acc to desc given',()=>{
      let todo = new ToDo('My ToDo');
      let item1 = new ToDoItem('Item 1');
      let item2 = new ToDoItem('Item 2');
      todo.addItem('Item 1');
      todo.addItem('Item 2');
      assert.deepEqual(todo.getItemByDesc('Item 1'),item1);
      assert.deepEqual(todo.getItemByDesc('Item 2'),item2);
      assert.deepEqual(todo.getItems(),{'Item 1':item1,'Item 2':item2})
    });
  });

  describe('addItem',()=>{
    it('should add item object to items with item Desc as key',()=>{
      let todo = new ToDo('My ToDo');
      let item1 = new ToDoItem('Item 1')
      todo.addItem('Item 1');
      assert.deepEqual(todo.getItemByDesc('Item 1'),item1);
    });
  });

  describe('deleteItem',()=>{
    it('should delete item by given desc',()=>{
      let todo = new ToDo('My ToDo');
      let item1 = new ToDoItem('Item 1')
      todo.addItem('Item 1');
      todo.deleteItem('Item 1');
      assert.deepEqual(todo.getItems(),{});
    });
  });

  describe('getItemsDescInList',()=>{
    it('should return list of all toDoItem description',()=>{
      let todo = new ToDo('My ToDo');
      let item1 = new ToDoItem('Item 1');
      let item2 = new ToDoItem('Item 2');
      todo.addItem('Item 1');
      todo.addItem('Item 2');
      assert.deepEqual(todo.getItemsDescInList(),['Item 1','Item 2'])
    });
  });

  describe('editDescOfItem',()=>{
    it('should edit description of given item by new desc',()=>{
      let todo = new ToDo('My ToDo');
      let item1 = new ToDoItem('Item 1')
      todo.addItem('Item 1');
      let newItem = new ToDoItem('New Item');
      todo.editDescOfItem('Item 1','New Item');
      let allItems = {'New Item':newItem};
      assert.deepEqual(todo.getItems(),allItems);
    });
  });

  describe('checkItem',()=>{
    it('should set checkedValue of given item to true',()=>{
      let todo = new ToDo('My ToDo');
      todo.addItem('Item 1');
      todo.checkItem('Item 1');
      let item1 = new ToDoItem('Item 1')
      item1.check();
      let allItems = {'Item 1':item1};
      assert.deepEqual(todo.getItems(),allItems)
    });
  });

  describe('uncheckItem',()=>{
    it('should set checkedValue of given item to true',()=>{
      let todo = new ToDo('My ToDo');
      todo.addItem('Item 1');
      todo.uncheckItem('Item 1');
      let item1 = new ToDoItem('Item 1')
      item1.uncheck();
      let allItems = {'Item 1':item1};
      assert.deepEqual(todo.getItems(),allItems)
    });
  });

  describe('mapItems', function(){
    it('shoud run provided mapper function on all items', function(){
      let toHtmlItemList = function(item) {
        return `<li id="${item.getDesc()}"><input type='checkbox'></input>${item.getDesc()}<button id="${item.getDesc()}">Delete</button></li>`;
      };
      let expected=`<li id="Item 1"><input type='checkbox'></input>Item 1<button id="Item 1">Delete</button></li><li id="Item 2"><input type='checkbox'></input>Item 2<button id="Item 2">Delete</button></li>`;
      let todo = new ToDo('My ToDo');
      todo.addItem('Item 1');
      todo.addItem('Item 2');
      assert.deepEqual(todo.mapItems(toHtmlItemList),expected)
    });

  });

})
