const toItemList = function(item) {
  let itemDesc = item.getDesc();
  let itemStatus = item.getCheckedValue();
  if(itemStatus)
    return `<div id='${itemDesc}'><li><input type='checkbox' checked></input>${itemDesc}<button>Delete</button></li></div>`;
  return `<div id='${itemDesc}'><li><input type='checkbox'></input>${itemDesc}<button>Delete</button></li></div>`
}



module.exports = {
  toItemList
}
