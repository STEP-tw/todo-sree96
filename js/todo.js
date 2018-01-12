const ToDo=function (title) {
 this.title=title;
 this.listItems=[];
}

ToDo.prototype.addDescription = function (description) {
  this.description=description;
};

ToDo.prototype.addNewListItem = function (listItem) {
  let li={`${listItem}`:false};
  this.listItems.push(li);
};

ToDo.prototype.getSpecificListItem = function (listItem) {
  let li=this.listItems.find(function (current) {
    Object.keys(current)[0]==listItem;
  });
  return li||'';
};

ToDo.prototype.getTitle = function () {
  return this.title;
};

ToDo.prototype.getAllListItems = function () {
  return this.listItems;
};

ToDo.prototype.idDone = function (listItem) {
  let li=this.listItems.find(function (current) {
    Object.keys(current)[0]==listItem;
  });
  
};
