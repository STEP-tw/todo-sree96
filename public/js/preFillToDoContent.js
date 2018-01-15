const fillItemList=function () {
  return ;
}

const preFillToDoContent=function () {
  addNameAndLogout();
  document.getElementById('title').value=todoTitle;
  document.getElementById('description').value=toDoContent.description;
  fillItemList();
}

window.onload=preFillToDoContent;
