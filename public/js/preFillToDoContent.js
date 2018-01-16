const fillItemList=function () {
  let itemListArea=document.getElementById('items');
  let itemList=toDoContent.itemList;
  let content='';
  itemList.forEach(function(item) {
    content+=`${Object.keys(item)[0]}\n`
  });
  itemListArea.value=content;
}

const preFillToDoContent=function () {
  addNameAndLogout();
  document.getElementById('title').value=todoTitle;
  document.getElementById('description').value=toDoContent.description;
  fillItemList();
}

window.onload=preFillToDoContent;
