const Item = require('./toDoItem.js');

const ToDo =  function(title,desc) {
  this.title = title;
  this.desc = desc || "";
  this.items = {};
};

ToDo.prototype.editTitle = function(newTitle) {
  this.title = newTitle;
};

ToDo.prototype.getTitle = function() {
  return this.title;
};

ToDo.prototype.editDesc = function(newDesc) {
  this.desc = newDesc;
};

ToDo.prototype.getDesc = function() {
  return this.desc;
};

ToDo.prototype.addItem = function(itemDesc) {
  this.items[`${itemDesc}`] = new Item(itemDesc);
};

ToDo.prototype.getItems = function() {
  return this.items;
}

ToDo.prototype.getItemByDesc = function(itemDesc) {
  return this.items[`${itemDesc}`];
};

ToDo.prototype.deleteItem = function(itemDesc) {
  delete this.items[`${itemDesc}`];
};

ToDo.prototype.getItemsDescInList = function() {
  let keys = Object.keys(this.items);
  return keys;
}

ToDo.prototype.checkItem = function(itemDesc) {
  let currItem = this.getItemByDesc(itemDesc);
  currItem.check();
}

ToDo.prototype.uncheckItem = function(itemDesc) {
  let currItem = this.getItemByDesc(itemDesc);
  currItem.uncheck();
}

ToDo.prototype.getAllItemsInHtmlList = function() {
  let allItemsDesc = this.getItemsDescInList();
  let list = '<ul>';
  allItemsDesc.forEach(function(desc) {
    list += `<li id="${desc}">${desc}<button id="${desc}">Delete</button></li>`
  })
  list += '</ul>';
  return list;
}

ToDo.prototype.editDescOfItem = function(oldDesc,newDesc) {
  let oldItem = this.getItemByDesc(oldDesc);
  oldItem.editDesc(newDesc);
  let newItem = oldItem;
  this.items[`${newDesc}`] = newItem;
  delete this.items[`${oldDesc}`];
}

module.exports = ToDo;
