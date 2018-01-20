const fs = require('fs');
const qs = require('querystring');
const utils = require('./utils.js');
const User = require('./lib/user.js');
const _registeredUsers=[{userName:'sree',name:'sreenadh',password:"password"},
  {userName:'pranavb',name:'pranavb',password:'password'}];

let data = {};
let pranavb = new User('pranavb');
data['pranavb'] = pranavb;


const serve404=(req,res)=>{
  res.statusCode = 404;
  res.setHeader('Content-Type','text/html');
  res.write(fs.readFileSync('./public/fileNotFound.html'));
  res.end();
  return ;
};

const getContentType=function (resourcePath) {
  let splitedPath=resourcePath.split(".");
  return splitedPath[splitedPath.length-1];
};

const setContentType=function (res,resourcePath) {
  let contentTypes={
    'html':"text/html",
    'jpg':"image/jpeg",
    'gif':"image/gif",
    'css':"text/css",
    'png':"image/png",
    'ico':"icon/ico",
    'pdf':"application/pdf",
    'js':"text/javascript",
  };
  let extension=getContentType(resourcePath);
  res.statusCode=200;
  res.setHeader("Content-Type",contentTypes[extension]);
};

const toS = o=>JSON.stringify(o,null,2);

//==========================================================================

const deleteToDo=(req,res)=>{
  let currUser = data[`${req.user.userName}`];
  currUser.deleteToDo(`${req.cookies.currentToDo}`)
  res.redirect('/home.html')
};

const serveStaticPage=function (req,res) {
  if (!req.user) {
    res.redirect('/login.html')
    return ;
  }
  let resourcePath=`./public${req.url}`;
  try {
    let filecontent=fs.readFileSync(resourcePath);
    setContentType(res,resourcePath);
    res.statusCode=200;
    res.write(filecontent);
    res.end();
    return ;
  } catch (e) {
    serve404(req,res);
    return;
  }
};

const showSingleToDo=(req,res)=>{
  let currUser = data[`${req.user.userName}`];
  let currToDo = currUser.getToDo(`${req.cookies.currentToDo}`)
  let toDoPage = fs.readFileSync('./public/showSingleToDo.html','utf8');
  toDoPage = toDoPage.replace('<toDoTitle></toDoTitle>',currToDo.getTitle());
  toDoPage = toDoPage.replace('<toDoDesc></toDoDesc>',currToDo.getDesc());
  toDoPage = toDoPage.replace('<allItems></allItems>', currToDo.getAllItemsInHtmlList());
  res.write(toDoPage);
  res.end();
};

const addNewTodo=(req,res)=>{
  let userName=req.user.userName;
  let currUser = data[`${userName}`];
  let title = req.body.title;
  let description = req.body.description;
  currUser.addToDo(title,description);
  res.redirect('/home.html')
};

const logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${utils.timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('./request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
};

const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = _registeredUsers.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

const verifyLogin=(req,res)=>{
  let user = _registeredUsers.find(u=>u.userName==req.body.userName&&u.password==req.body.password);
  if(!user) {
    res.setHeader('Set-Cookie',`message=Login Failed; Max-Age=5`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = process.env.sessionid ||new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  // let sendingFilePath=`./public/js/todos.js`;
  // let filePath=process.env.COMMENT_STORE||`./data/${user.userName}ToDos.json`;
  // let currentContent=JSON.parse(fs.readFileSync(filePath,"utf-8"));
  // fs.writeFileSync(sendingFilePath,`var todos=${toS(currentContent)}`);
  res.redirect('/home.html');
};

const serveHomePage=(req,res)=>{
  let homePage = fs.readFileSync('./public/home.html','utf8');
  let currUser = data[`${req.user.userName}`];
  res.setHeader('Content-Type','text/html');
  res.statusCode = 200;
  homePage = homePage.replace('<userName></userName>',req.user['name']);
  homePage = homePage.replace('<allToDoTitles></allToDoTitles>',currUser.getToDoTitlesInHtmlList('/showSingleToDo'));
  res.write(homePage);
  res.end();
}

const serveLoginPage=(req,res)=>{
  if (req.user) {
    res.redirect('/home.html');
    return;
  }
  res.setHeader('Content-Type','text/html');
  res.write(`<h1>Login</h1>`);
  res.write(`<p>${req.cookies.message||""}</p>`);
  res.write(fs.readFileSync("./public/login.html"));
  res.end();
};

const logoutUser=(req,res)=>{
  res.setHeader('Set-Cookie',`sessionid=0`);
  if (req.user) {
    delete req.user.sessionid;
  }
  res.redirect('/login.html');
};

const addNewItem=(req,res)=>{
  let currUser = data[`${req.user.userName}`];
  let currToDoTitle = req.cookies.currentToDo;
  currUser.addItemTo(currToDoTitle,req.body.item);
  res.redirect('/showSingleToDo');
};

const redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/','/login.html']) && req.user) {
    res.redirect('/home.html');
  }
};

const redirectLoggedOutUserToLogin = (req,res)=>{
  let urlAllowedForOnlyLoggedIn = ['/', '/addNewTodo.html', '/addToToDoList.html', '/editAll.html', '/home.html', 'showSingleToDo.html', '/viewAll.html', '/deleteToDo', '/showSingleToDo', '/addNewTodo', '/addNewItem', '/edit'];
  if(req.urlIsOneOf(urlAllowedForOnlyLoggedIn) && !req.user) {
    res.redirect('/login.html');
  }
};

const deleteItemAndGetUpdatedList = (req,res)=>{
  let currentToDo = req.cookies.currentToDo;
  let currUser = data[`${req.user.userName}`];
  currUser.deleteItemOf(currentToDo,req.body['item']);
  currTodo = currUser.getToDo(currentToDo);
  updatedItemList = currTodo.getItemsDescInList();
  res.write(JSON.stringify(updatedItemList));
  res.end();
};

module.exports={
  deleteToDo,
  serveStaticPage,
  showSingleToDo,
  addNewTodo,
  logRequest,
  loadUser,
  verifyLogin,
  serveLoginPage,
  logoutUser,
  addNewItem,
  redirectLoggedOutUserToLogin,
  redirectLoggedInUserToHome,
  serveHomePage,
  deleteItemAndGetUpdatedList
}
