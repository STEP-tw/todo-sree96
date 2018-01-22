const deleteItem = function(event) {
  let updateItemDisplay = function() {
    document.getElementById(event.target.parentNode.parentNode.id).remove();
  }
  let itemDesc = event.target.parentNode.parentNode.id;

  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener("load",updateItemDisplay)
  xmlReq.open("POST","/deleteItem");
  xmlReq.send(`item=${itemDesc}`);
}

const updateItemStatus = function(event) {
  let resListener=function () {
    return;
  }
  let id=event.target.parentNode.parentNode.id;
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("click", resListener);
  oReq.open("POST", '/updateItemStatus');
  oReq.send(`item=${id}&itemStatus=${event.target.checked}`);
}

const addEventListenerToButtons = function() {
  let allButtons = document.getElementsByTagName('button');
  let buttonIndexes = Object.keys(allButtons);
  buttonIndexes.forEach(function(buttonIndex){
    let button = allButtons[`${buttonIndex}`];
    button.onclick = deleteItem;
  })
}

const addEventListenerToCheckboxes = function() {
  let checkboxes = document.getElementById('allItems').querySelectorAll('input');
  let checkboxIndexes = Object.keys(checkboxes);
  checkboxIndexes.forEach(function(checkboxIndex){
    let checkbox = checkboxes[`${checkboxIndex}`];
    checkbox.onclick = updateItemStatus;
  })
}


const addEventListeners = function() {
  addEventListenerToButtons();
  addEventListenerToCheckboxes();
}

window.onload = addEventListeners;
