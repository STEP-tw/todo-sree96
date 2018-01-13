const showToDoContent=function () {
  addNameAndLogout();
  let content=document.getElementById('content');
  document.getElementById('title').innerText=todoTitle;
  let itemList=[];
  itemList=toDoContent.itemList;
  if (itemList.length!=0) {
    let innerHtml=`<table onclick="mark(event)"><th></th><th></th>`;
    itemList.forEach(function (item) {
      let paresedItem=Object.keys(item)[0];
      innerHtml+=`<tr><td><input type="checkbox" id="${paresedItem}"></td><td>${paresedItem}</td></tr>`;
    })
    innerHtml+="</table>";
    content.innerHTML=innerHtml;
    let checkboxes=document.querySelectorAll("input");
    checkboxes.forEach(function (checkbox,index) {
      let paresedItem=Object.keys(itemList[index]);
      let status=itemList[index][paresedItem];
      let id=checkbox.id;
      document.getElementById(id).checked=status;
    })
  }
}

window.onload=showToDoContent;
