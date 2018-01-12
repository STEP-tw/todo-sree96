const http = require('http');
const fs = require('fs');
const WebApp = require('./webapp');
const querystring = require('querystring');
const PORT=8004;
const _registeredUsers=[
  {userName:'sree',name:'sreenadh',password:"password"},
  {userName:'sreenu',name:'sreenu',password:"password"}];
let app=WebApp.create();
let contentTypes={
  'html':"text/html",
  'jpg':"image/jpeg",
  'gif':"image/gif",
  'css':"text/css",
  'png':"image/png",
  'pdf':"application/pdf",
  'js':"text/javascript",
};
const toS = o=>JSON.stringify(o,null,2);

const timeStamp = ()=>{
  let t = new Date();
  return `${t.toDateString()} ${t.toLocaleTimeString()}`;
}

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('./logs/request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
};

const getContentType=function (resourcePath) {
  let splitedPath=resourcePath.split(".");
  return splitedPath[splitedPath.length-1];
};

const setContentType=function (res,resourcePath) {
  let extension=getContentType(resourcePath);
  res.writeHead(200,{"Content-Type": contentTypes[extension]});
};

const writeToPage=function (req,res) {
  let resourcePath=`./public${req.url}`;
  try {
    let filecontent=fs.readFileSync(resourcePath);
    setContentType(res,resourcePath);
    res.write(filecontent);
    res.end();
  } catch (e) {
    res.statusCode = 404;
    res.redirect('/fileNotFound.html');
    res.end();
    return;
  }
};

const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = _registeredUsers.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

app.use(logRequest)
app.use(loadUser);
app.addPostprocess(writeToPage);

app.get('/',(req,res)=>{
  if (req.user) {
    res.redirect('/home.html');
  }
  res.redirect('/login.html');
});

app.get('/login.html',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(`<h1>Login</h1>`);
  res.write(`<p>${req.cookies.message||""}</p>`);
  res.write(fs.readFileSync("./public/login.html"));
  res.end();
});

app.post('/login',(req,res)=>{
  let user = _registeredUsers.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`message=Login Failed; Max-Age=5`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home.html');
});

app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie',`sessionid=0`);
  delete req.user.sessionid;
  res.redirect('/login.html');
});


let server=http.createServer(app);
server.listen(PORT);
console.log(`Listening to port ${PORT}.......`);
