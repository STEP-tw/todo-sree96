const deleteItem = function(event) {
  let updateItemDisplay = function() {
    document.getElementById(event.target.id).remove();
  }

  let itemDesc = event.target.id;

  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener("load",updateItemDisplay)
  xmlReq.open("POST","/deleteItem");
  xmlReq.send(`item=${itemDesc}`);
}

const addEventListenerToAllButtons = function() {
  let allButtons = document.getElementsByTagName('button');
  let buttonIndexes = Object.keys(allButtons);
  buttonIndexes.forEach(function(buttonIndex){
    let button = allButtons[`${buttonIndex}`];
    button.onclick = deleteItem;
  })
}

window.onload = addEventListenerToAllButtons;
