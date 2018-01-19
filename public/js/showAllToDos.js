const showAllToDos=function () {
  addName();
  let allToDoList=document.getElementById('allToDoList');
  let titles=Object.keys(todos);
  let innerHtml='';
  titles.forEach(function (title) {
    innerHtml+=`<ul><a href='/getClickedToDo${title}'>${title}</a><li>${todos[title].description}</li></ul>`
  });
  allToDoList.innerHTML=innerHtml;
}

window.onload=showAllToDos;
