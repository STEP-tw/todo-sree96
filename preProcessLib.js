const fs = require('fs');
const toS = o=>JSON.stringify(o,null,2);

const _registeredUsers=[
  {userName:'sree',name:'sreenadh',password:"password"},
  {userName:'sreenu',name:'sreenu',password:"password"},
  {userName:'sudhin',name:'sudhin',password:"password"}];


const timeStamp = ()=>{
  let t = new Date();
  return `${t.toDateString()} ${t.toLocaleTimeString()}`;
}

const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = _registeredUsers.find(u=>u.sessionid==sessionid);
  console.log(user);
  if(sessionid && user){
    req.user = user;
  }
};

const logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('./request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
};


module.exports = {
  logRequest,
  loadUser
}
