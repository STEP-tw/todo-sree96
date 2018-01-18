let chai = require('chai');
let assert = chai.assert;
let Todo=require('../models/todo.js');
let TodoItem=require('../models/todoItem.js');
let todo={};

describe('Todo', function(){
  beforeEach(function(){
    todo=new Todo("Home Work","Sujects to finish home work");
  });
  describe('Creates New Todo', function(){
    it('Creates a new todo with title,description and empty items list', function(){
      assert.deepEqual(todo,{'title':"Home Work",'description':"Sujects to finish home work",'listItems':[]});
    });
  });
  describe('#getTitle', function(){
    it('Should return the title of a todo', function(){
      assert.deepEqual(todo.getTitle(),"Home Work");
    });
  });
  describe('#getDescription', function(){
    it('Should return the description of a todo', function(){
      assert.deepEqual(todo.getDescription(),"Sujects to finish home work");
    });
  });
  describe('#addNewListItem', function(){
    it('Should add a list item to the todo', function(){
      let expected={'title':"Home Work",'description':"Sujects to finish home work",'listItems':[{'item':'Maths','status':false}]};
      todo.addNewListItem("Maths")
      assert.deepEqual(todo,expected);
    });
  });
  describe('#getSpecificListItem()', function(){
    it('Should return specified list item from a todo when it is present', function(){
      let expected={'item':'English','status':false};
      todo.addNewListItem("Maths");
      todo.addNewListItem("English");
      assert.deepEqual(todo.getSpecificListItem('English'),expected);
    });
    it('Should return "" list item from a todo when it is not present', function(){
      todo.addNewListItem("Maths");
      todo.addNewListItem("English");
      assert.deepEqual(todo.getSpecificListItem('Science'),'');
    });
  });
  describe('#editTitle', function(){
    it('Should edit the title of a todo', function(){
      let expected={'title':"Studies",'description':"Sujects to finish home work",'listItems':[]};
      assert.deepEqual(todo,{'title':"Home Work",'description':"Sujects to finish home work",'listItems':[]});
      todo.editTitle("Studies")
      assert.deepEqual(todo,expected);
    });
  });
  describe('#editDescription', function(){
    it('Should edit the description of a todo', function(){
      let expected={'title':"Home Work",'description':"Sujects having home work to do",'listItems':[]};
      assert.deepEqual(todo,{'title':"Home Work",'description':"Sujects to finish home work",'listItems':[]});
      todo.editDescription("Sujects having home work to do")
      assert.deepEqual(todo,expected);
    });
  });
  
});
