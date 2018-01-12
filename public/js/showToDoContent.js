const showToDoContent=function () {
  let content=document.getElementById('content');
  document.getElementById('title').innerText=Object.keys(toDoContent)[0];
  let itemList=[];
  itemList=toDoContent.itemList;
  if (itemList.length!=0) {
    let innerHtml="<table><th></th><th></th>";
    itemList.forEach(function (item) {
      innerHtml+=`<tr><td><input type="checkbox" name="item" ></td><td>${item}</td></tr>`;
    })
    innerHtml+="</table>";
    content.innerHTML=innerHtml;
  }
}

window.onload=showToDoContent;
