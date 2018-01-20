const fs = require('fs');
const qs = require('querystring');
const utils = require('./utils.js');
const User = require('./lib/user.js');

const _registeredUsers=[
  {userName:'sree',name:'sreenadh',password:"password"},
  {userName:'sreenu',name:'sreenu',password:"password"},
  {userName:'sudhin',name:'sudhin',password:"password"}];

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

const getAllToDo=(req)=>{
  let filePath=`./data/${req.user.userName}ToDos.json`
  let allToDos=JSON.parse(fs.readFileSync(filePath,"utf-8"));
  return allToDos;
};

const getSpeciicToDo=(req)=>{
  let allToDos=getAllToDo(req);
  return allToDos[`${req.cookies.title}`];
}

const toS = o=>JSON.stringify(o,null,2);

const itemCreater=(newItem)=>{
  let itemObject={};
  itemObject[newItem]=false;
  return itemObject;
}

const ModifyTodo=(oldTodo,title,description,items)=>{
  let todo={'description':description,'itemList':[]};
  let oldItems=oldTodo.itemList;
  items.forEach((item,index)=>{
    todo.itemList.push(itemCreater(item));
  })
  return todo;
}

//==========================================================================

const deleteToDo=(req,res)=>{
  let userName=req.user.userName;
  let filePath=`./data/${userName}ToDos.json`;
  let sendingFilePath=`./public/js/todos.js`;
  let currentContent=getAllToDo(req);
  delete currentContent[req.cookies.title];
  fs.writeFileSync(filePath,JSON.stringify(currentContent));
  fs.writeFileSync(sendingFilePath,`var todos=${JSON.stringify(currentContent)}`);
  res.redirect('/viewAll.html')
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
  let wantedToDo=getSpeciicToDo(req);
  if (!wantedToDo) {
    res.redirect('/fileNotFound.html');
    return ;
  };
  let filePath='./public/js/toDoContent.js';
  fs.writeFileSync(filePath,`var toDoContent=${JSON.stringify(wantedToDo)};\nvar todoTitle="${req.cookies.title}"`);
  res.redirect('/showSingleToDo.html');
};

const addNewTodo=(req,res)=>{
  let userName=req.user.userName;
  let filePath=`./data/${userName}ToDos.json`;
  let sendingFilePath=`./public/js/todos.js`;
  let newToDoData={'description':`${req.body.description}`,'itemList':[]};
  let currentContent=getAllToDo(req);
  currentContent[`${req.body.title}`]=newToDoData;
  fs.writeFileSync(filePath,JSON.stringify(currentContent));
  fs.writeFileSync(sendingFilePath,`var todos=${JSON.stringify(currentContent)}`);
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
  let sessionid = new Date().getTime();
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
  res.setHeader('Content-Type','text/html');
  res.statusCode = 200;
  homePage = homePage.replace('<userName></userName>',req.user['name']);
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
  let newToDoItem={};
  let userName=req.user.userName;
  let filePath=`./data/${userName}ToDos.json`;
  let sendingFilePath=`./public/js/todos.js`;
  let title=req.cookies.title;
  let item=req.body.item;
  newToDoItem[`${item}`]=false;
  let currentContent=JSON.parse(fs.readFileSync(filePath,"utf-8"));
  currentContent[title].itemList.push(newToDoItem);
  fs.writeFileSync(filePath,JSON.stringify(currentContent));
  fs.writeFileSync(sendingFilePath,`var todos=${JSON.stringify(currentContent)}`);
  res.redirect('/showSingleToDo');
};

const editTodo=(req,res)=>{
  let newTitle=req.body.title;
  let description=req.body.description;
  let userName=req.user.userName;
  let filePath=`./data/${userName}ToDos.json`;
  let sendingFilePath=`./public/js/todos.js`;
  let items=qs.unescape(req.body.items).split('\r\n');
  items=items.filter(function (item) {
    return item!="";
  });
  let allToDos=getAllToDo(req);
  let oldTodo=getSpeciicToDo(req);
  let modifiedTodo=ModifyTodo(oldTodo,newTitle,description,items);
  delete allToDos[req.cookies.title];
  allToDos[newTitle]=modifiedTodo;
  fs.writeFileSync(filePath,JSON.stringify(allToDos));
  fs.writeFileSync(sendingFilePath,`var todos=${JSON.stringify(allToDos)}`);
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
  editTodo,
  redirectLoggedOutUserToLogin,
  redirectLoggedInUserToHome,
  serveHomePage
}
