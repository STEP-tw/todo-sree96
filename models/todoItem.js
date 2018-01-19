class TodoItem {
  constructor(item) {
    this.item=item;
    this.status=false;
  }
  editItem(item){
    this.item=item;
  }
  getItem(){
    return this.item;
  }
  isDone(){
    return this.status;
  }
  check(){
    this.status=true;
  }
  uncheck(){
    this.status=false;
  }
}

module.exports=TodoItem;
