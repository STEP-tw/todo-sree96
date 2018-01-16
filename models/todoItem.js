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
  setStatus(status){
    this.status=status;
  }
}

module.exports=TodoItem;
