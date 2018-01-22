const toItemList = function(item) {
  let itemDesc = item.getDesc();
  let itemStatus = item.getCheckedValue();
  if(itemStatus)
    return `<li><input type='checkbox' id='${itemDesc}' checked></input>${itemDesc}<button id='${itemDesc}'>Delete</button></li>`;
  return `<li><input type='checkbox' id='${itemDesc}'></input>${itemDesc}<button id='${itemDesc}'>Delete</button></li>`

}



module.exports = {
  toItemList
}
