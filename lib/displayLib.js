const toItemList = function(item) {
  return `<li id="${item}"><input type='checkbox'></input>${item}<button id="${item}">Delete</button></li>`;
}



module.exports = {
  toItemList
}
