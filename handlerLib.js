const fs = require('fs');
const qs = require('querystring');
const utils = require('./utils.js');
const User = require('./lib/user.js');
const displayLib = require('./lib/displayLib.js');
const _registeredUsers=[{userName:'pranavb', name:'pranavb', password:'password'}, {userName:'sree',name:'sreenadh',password:"password"}];

let data = {};
let pranavb = new User('pranavb');
data['pranavb'] = pranavb;
let sree = new User('sree');
data['sree'] = sree;


const toS = o=>JSON.stringify(o,null,2);

//==========================================================================

const deleteToDo=(req,res)=>{
  let currUser = data[`${req.user.userName}`];
  currUser.deleteToDo(`${req.cookies.currentToDo}`)
  res.redirect('/homePage')
};

const showSingleToDo=function(req,res){
  let currUser = data[`${req.user.userName}`];
  let currToDo = currUser.getToDo(`${req.cookies.currentToDo}`);
  let toDoPage = this.fs.readFileSync('./public/showSingleToDo.html','utf8');
  toDoPage = toDoPage.replace('<toDoTitle></toDoTitle>',currToDo.getTitle());
  toDoPage = toDoPage.replace('<toDoDesc></toDoDesc>',currToDo.getDesc());
  let itemList = `<ul>${currToDo.mapItems(displayLib.toItemList)}</ul>`;
  toDoPage = toDoPage.replace('<allItems></allItems>',itemList);
  res.send(toDoPage);
  res.end();
};

const addNewTodo=(req,res)=>{
  let userName=req.user.userName;
  let currUser = data[`${userName}`];
  let title = req.body.title;
  let description = req.body.description;
  currUser.addToDo(title,description);
  res.redirect('/homePage')
};

const logRequest = function(req,res,next){
  let text = ['------------------------------',
    `${utils.timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  this.fs.appendFileSync('./request.log',text);
  console.log(`${req.method} ${req.url}`);
  next();
};

const loadUser = (req,res,next)=>{
  let sessionid = req.cookies.sessionid;
  let user = _registeredUsers.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
  next();
};

const verifyLogin=function(req,res){
  let user = _registeredUsers.find(u=>u.userName==req.body.userName&&u.password==req.body.password);
  if(!user) {
    res.setHeader('Set-Cookie',`message=Login Failed; Max-Age=5`);
    res.redirect('/loginPage');
    return;
  }
  let sessionid = this.sessionidGenerator();
  res.cookie(`sessionid`,`${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/homePage');
};

const serveHomePage=function(req,res){
  let homePage = this.fs.readFileSync('./public/home.html','utf8');
  let currUser = data[`${req.user.userName}`];
  res.setHeader('Content-Type','text/html');
  res.statusCode = 200;
  homePage = homePage.replace('<userName></userName>',req.user['name']);
  homePage = homePage.replace('<allToDoTitles></allToDoTitles>',currUser.getToDoTitlesInHtmlList('/showSingleToDo'));
  res.send(homePage);
  res.end();
}

const serveLoginPage=function(req,res){
  let message=req.cookies.message||''
  res.setHeader('Content-Type','text/html');
  res.send(`${message}${this.fs.readFileSync("./public/login.html")}`);
};

const logoutUser=(req,res)=>{
  res.cookie(`sessionid`,`0`);
  delete req.user.sessionid;
  res.redirect('/loginPage');
};

const addNewItem=(req,res)=>{
  let currUser = data[`${req.user.userName}`];
  let currToDoTitle = req.cookies.currentToDo;
  currUser.addItemTo(currToDoTitle,req.body.item);
  res.redirect('/showSingleToDo');
};

const redirectLoggedInUserToHome = (req,res,next)=>{
  if(['/','/loginPage'].includes(req.url)&& req.user) {
    res.redirect('/homePage');
  } else {
    next();
  }
};

const redirectLoggedOutUserToLogin = (req,res,next)=>{
  let urlAllowedForOnlyLoggedIn = ['/','/homePage', '/showSingleToDo.html', , '/deleteToDo', '/showSingleToDo', '/addNewTodo', '/addNewItem', '/edit'];
  if(urlAllowedForOnlyLoggedIn.includes(req.url)&& !req.user) {
    res.redirect('/loginPage');
  }
  else {
    next();
  }
};

const deleteItemAndGetUpdatedList = (req,res)=>{
  let currentToDo = req.cookies.currentToDo;
  let currUser = data[`${req.user.userName}`];
  currUser.deleteItemOf(currentToDo,req.body['item']);
  currTodo = currUser.getToDo(currentToDo);
  updatedItemList = currTodo.getItemsDescInList();
  res.send(JSON.stringify(updatedItemList));
  res.end();
};

const updateItemStatus = (req,res)=>{
  // debugger;
  let item = req.body.item;
  let checkedStatus = req.body.itemStatus;
  let currUser = data[`${req.user.userName}`];
  let currToDo = currUser.getToDo(`${req.cookies.currentToDo}`);
  if(checkedStatus=="true") {
    currUser.checkItemOf(currToDo.getTitle(),item);
  }
  else {
    currUser.uncheckItemOf(currToDo.getTitle(),item);
  }
  let updatedItem = currToDo.getItemByDesc(item);
  res.send(JSON.stringify(updatedItem))
  res.end();
}

const editTitle = (req,res)=>{
  let newTitle = req.body.newTitle;
  let currUser = data[`${req.user.userName}`];
  let currToDo = currUser.getToDo(`${req.cookies.currentToDo}`);
  if (newTitle==currToDo.getTitle()) {
    res.redirect('/showSingleToDo');
    return ;
  }
  currUser.editTitleOf(currToDo.getTitle(),newTitle);
  res.setHeader('Set-Cookie',`currentToDo=${currToDo.getTitle()}`);
  res.redirect('/showSingleToDo');
}

const editDesc = (req,res)=>{
  let newDesc = req.body.newDesc;
  let currUser = data[`${req.user.userName}`];
  let currToDo = currUser.getToDo(`${req.cookies.currentToDo}`);
  if (newDesc==currToDo.getDesc()) {
    res.redirect('/showSingleToDo');
    return ;
  }
  currUser.editDescOf(currToDo.getTitle(),newDesc);
  res.redirect('/showSingleToDo');
}

module.exports={
  deleteToDo,
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
  deleteItemAndGetUpdatedList,
  updateItemStatus,
  editTitle,
  editDesc
}
