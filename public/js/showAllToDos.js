const showAllToDos=function () {
  let allToDoList=document.getElementById('allToDoList');
  let titles=Object.keys(todos);
  let innerHtml='';
  titles.forEach(function (title) {
    innerHtml+=`<ul><a href='/getClickedToDo${title}'>${title}</a><li>${JSON.stringify(todos[title],null,2)}</li></ul>`
  });
  allToDoList.innerHTML=innerHtml;
}

window.onload=showAllToDos;
