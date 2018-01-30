const timeStamp = ()=>{
  let t = new Date();
  return `${t.toDateString()} ${t.toLocaleTimeString()}`;
}

const sessionidGenerator = function(){
  return new Date().getTime();
}

module.exports = {
  timeStamp,
  sessionidGenerator
}
