const ToDo = require('./toDo.js');

const User = function(name) {
  this.name = name;
  this.allToDo =  {};
}

User.prototype.getName = function() {
  return this.name;
}

User.prototype.getAllToDo = function() {
  return this.allToDo;
}

User.prototype.addToDo = function(title,desc) {
  let currTodo = new ToDo(title,desc);
  let allToDo = this.getAllToDo();
  allToDo[`${title}`] = currTodo;
}

User.prototype.getToDo = function(title) {
  let allToDo = this.getAllToDo();
  return allToDo[`${title}`];
}

User.prototype.deleteToDo = function(title) {
  let allToDo = this.getAllToDo();
  delete allToDo[`${title}`];
}

User.prototype.editTitleOf = function(oldTitle,newTitle) {
  let oldTodo = this.getToDo(oldTitle);
  oldTodo.editTitle(newTitle);
  let newToDo = oldTodo;
  let allToDo = this.getAllToDo();
  allToDo[`${newTitle}`] = newToDo;
  delete allToDo[`${oldTitle}`];
}

User.prototype.editDescOf = function(toDoTitle,newDesc) {
  let currTodo = this.getToDo(toDoTitle);
  currTodo.editDesc(newDesc);
}

User.prototype.addItemTo = function(toDoTitle,itemDesc) {
  let currTodo = this.getToDo(toDoTitle);
  currTodo.addItem(itemDesc);
}

User.prototype.checkItemOf = function(toDoTitle,itemDesc) {
  let currTodo = this.getToDo(toDoTitle);
  currTodo.checkItem(itemDesc);
}

User.prototype.uncheckItemOf = function(toDoTitle,itemDesc) {
  let currTodo = this.getToDo(toDoTitle);
  currTodo.uncheckItem(itemDesc);
}

User.prototype.getAllToDoTitles = function() {
  let allToDo = this.getAllToDo()
  return Object.keys(allToDo);
}

User.prototype.getToDoTitlesInHtmlList = function(link) {
  let allToDoTitles = this.getAllToDoTitles();
  let list = '<ul>';
  allToDoTitles.forEach(function(title) {
    list += `<li><a href="${link}"><button id="${title}">${title}</button></a></li>`
  })
  list += '</ul>';
  return list;
}

User.prototype.deleteItemOf = function(toDoTitle,itemDesc) {
  let currTodo = this.getToDo(toDoTitle);
  let allItems = currTodo.getItems();
  delete allItems[`${itemDesc}`];
}


module.exports = User;
