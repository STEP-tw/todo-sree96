const TodoItem = require('./todoitem.js');
class Todo {
  constructor(title,description='') {
    this.title=title;
    this.description=description;
    this.listItems=[];
  }
  addNewListItem(item) {
    let newItem=new TodoItem(item);
    this.listItems.push(newItem);
  }
  getTitle() {
    return this.title;
  }
  getDescription(){
    return this.description;
  }
  getAllListItems() {
    return this.listItems;
  }
  getSpecificListItem(listItem) {
    let li=this.listItems.find(function (current) {
      return current[Object.keys(current)[0]]==listItem;
    });
    return li||"";
  }
  editTitle(title){
    this.title=title;
  }
  editDescription(description){
    this.description=description;
  }
  isDone(item){
    let oIndex;
    let li=this.listItems.find(function (current,index) {
      oIndex=index;
      return current[Object.keys(current)[0]]==listItem;
    });
    return this.listItems[oIndex][listItem];
  }
}

module.exports=Todo;
