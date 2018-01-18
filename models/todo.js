const TodoItem = require('./todoitem.js');
class Todo {
  constructor(title) {
    this.title=title;
    this.listItem=[];
  }
  addDescription(description) {
    this.description=description;
  }
  addNewListItem(item) {
    this.listItems.push(new TodoItem(item));
  }
  getTitle() {
    return this.title;
  }
  getAllListItems() {
    return this.listItems;
  }
  isDone(item){
    let oIndex;
    let li=this.listItems.find(function (current,index) {
      oIndex=index;
      return Object.keys(current)[0]==listItem;
    });
    return this.listItems[oIndex][listItem];
  }
  getSpecificListItem(listItem) {
    let li=this.listItems.find(function (current) {
      return Object.keys(current)[0]==listItem;
    });
    return li||"";
  }
  editTitle(title){
    this.title=title;
  }
  editDescription(description){
    this.description=description;
  }
}
