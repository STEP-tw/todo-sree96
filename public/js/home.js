const setTitleToCookie = function(event) {
  let toDoTitle = event.target.id;
  document.cookie = `currentToDo = ${toDoTitle}`;
}


const addEventListenerToAllButtons = function() {
  let allButtons = document.getElementsByTagName('button');
  let buttonIndexes = Object.keys(allButtons);
  buttonIndexes.forEach(function(buttonIndex){
    let button = allButtons[`${buttonIndex}`];
    button.onclick = setTitleToCookie;
  })
}

window.onload = addEventListenerToAllButtons;
