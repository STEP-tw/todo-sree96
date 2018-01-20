const ToDoItem = function(desc) {
  this.desc = desc;
  this.checkedValue = false;
};

ToDoItem.prototype.editDesc = function(newDesc) {
  this.desc = newDesc;
}

ToDoItem.prototype.check = function() {
  this.checkedValue = true;
}

ToDoItem.prototype.uncheck = function() {
  this.checkedValue = false;
}

ToDoItem.prototype.getDesc = function() {
  return this.desc;
}

ToDoItem.prototype.getCheckedValue = function() {
  return this.checkedValue;
}

module.exports = ToDoItem;
