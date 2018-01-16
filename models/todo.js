const ToDo=function (title) {
 this.title=title;
 this.listItems=[];
}

ToDo.prototype.addDescription = function (description) {
  this.description=description;
};

ToDo.prototype.addNewListItem = function (listItem) {
  let li={};
  li[`${listItem}`]=false;
  this.listItems.push(li);
};

ToDo.prototype.getSpecificListItem = function (listItem) {
  let li=this.listItems.find(function (current) {
    return Object.keys(current)[0]==listItem;
  });
  return li||"";
};

ToDo.prototype.getTitle = function () {
  return this.title;
};

ToDo.prototype.getAllListItems = function () {
  return this.listItems;
};

ToDo.prototype.isDone = function (listItem) {
  let oIndex;
  let li=this.listItems.find(function (current,index) {
    oIndex=index;
    return Object.keys(current)[0]==listItem;
  });
  return this.listItems[oIndex][listItem];
};
