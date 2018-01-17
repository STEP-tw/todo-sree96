const fs = require('fs');
const WebApp = require('./webapp');
const querystring = require('querystring');
const _registeredUsers=[
  {userName:'sree',name:'sreenadh',password:"password"},
  {userName:'sreenu',name:'sreenu',password:"password"},
  {userName:'sudhin',name:'sudhin',password:"password"}];
let app=WebApp.create();
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
const toS = o=>JSON.stringify(o,null,2);

const timeStamp = ()=>{
  let t = new Date();
  return `${t.toDateString()} ${t.toLocaleTimeString()}`;
}

const logRequest = (req,res)=>{
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
  res.statusCode=200;
  res.setHeader("Content-Type",contentTypes[extension]);
};

const serve404=(req,res)=>{
  res.statusCode = 404;
  res.setHeader('Content-Type','text/html');
  res.write(fs.readFileSync('./public/fileNotFound.html'));
  res.end();
  return ;
}

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

const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = _registeredUsers.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

const titleSpliter=function (req) {
  let url=req.url;
  return url.split('/getClickedToDo')[1];
}

const gotoToDo=(req,res)=>{
  if (req.url.startsWith("/getClickedToDo")) {
    if (!req.user) {
      res.redirect('/fileNotFound.html');
      return ;
    }
    let title=titleSpliter(req);
    res.setHeader('Set-Cookie',`title=${title}`)
    res.redirect('/showSingleToDo');
  }
  return;
}

const markOnDataBase=(req,res,status)=>{
  let title=req.cookies.title;
  let item=req.url.split("&")[1].split('%')[0];
  let filePath=`./data/${req.user.userName}ToDos.json`;
  let sendingFilePath=`./public/js/toDoContent.js`;
  let allToDos=JSON.parse(fs.readFileSync(filePath,"utf-8"));
  let itemList=allToDos[title].itemList;
  let foundItem=itemList.find(function (current) {
    return Object.keys(current)[0]==item;
  });
  let index=itemList.indexOf(foundItem);
  foundItem[item]=status;
  allToDos[title].itemList[index]=foundItem;
  fs.writeFileSync(filePath,JSON.stringify(allToDos));
  let wantedToDo=allToDos[req.cookies.title];
  fs.writeFileSync('./public/js/toDoContent.js',`var toDoContent=${JSON.stringify(wantedToDo)};\nvar todoTitle="${req.cookies.title}"`);
  res.end();
}

const markAsDone=(req,res)=> {
  if (req.url.startsWith("/mark")) {
    if (!req.user) {
      res.redirect('/fileNotFound.html')
    }
    markOnDataBase(req,res,true);
  }
  return ;
}

const markAsNotDone=(req,res)=> {
  if (req.url.startsWith("/unmark")) {
    if (!req.user) {
      res.redirect('/fileNotFound.html')
    }
    markOnDataBase(req,res,false)
  }
  return ;
}

const writeToDataFile=(filePath,content)=>{
  fs.writeFileSync(filePath,content);
}

const getAllToDo=(req)=>{
  let filePath=`./data/${req.user.userName}ToDos.json`;
  let allToDos=JSON.parse(fs.readFileSync(filePath,"utf-8"));
  return allToDos;
}

const getSpeciicToDo=(req)=>{
  let allToDos=getAllToDo(req);
  return allToDos[req.cookies.title];
}

app.use(logRequest)
app.use(loadUser);
app.use(markAsDone);
app.use(markAsNotDone);

app.addPostprocess(gotoToDo);
app.addPostprocess(serveStaticPage);

const deleteToDo=(req,res)=>{
  let userName=req.user.userName;
  let filePath=`./data/${userName}ToDos.json`;
  let sendingFilePath=`./public/js/todos.js`;
  let currentContent=getAllToDo(req);
  delete currentContent[req.cookies.title];
  writeToDataFile(filePath,JSON.stringify(currentContent));
  writeToDataFile(sendingFilePath,`var todos=${JSON.stringify(currentContent)}`);
  res.redirect('/viewAll.html')
}

const showSingleToDo=(req,res)=>{
  let wantedToDo=getSpeciicToDo(req);
  if (!wantedToDo) {
    res.redirect('/fileNotFound.html');
    return ;
  }
  writeToDataFile('./public/js/toDoContent.js',`var toDoContent=${JSON.stringify(wantedToDo)};\nvar todoTitle="${req.cookies.title}"`);
  res.redirect('/showSingleToDo.html');
};

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
  let filePath=`./data/${user.userName}ToDos.json`;
  let sendingFilePath=`./public/js/todos.js`;
  let currentContent=JSON.parse(fs.readFileSync(filePath,"utf-8"));
  writeToDataFile(sendingFilePath,`var todos=${toS(currentContent)}`);
  writeToDataFile('./public/js/userName.js',`var user="Hello ${user.name}"`);
  res.redirect('/home.html');
};

const logoutUser=(req,res)=>{
  res.setHeader('Set-Cookie',`sessionid=0`);
  if (req.user) {
    delete req.user.sessionid;
  }
  res.redirect('/login.html');
};

const addNewTodo=(req,res)=>{
  let userName=req.user.userName;
  let filePath=`./data/${userName}ToDos.json`;
  let sendingFilePath=`./public/js/todos.js`;
  let newToDoData={'description':`${req.body.description}`,'itemList':[]};
  let currentContent=getAllToDo(req);
  currentContent[`${req.body.title}`]=newToDoData;
  writeToDataFile(filePath,JSON.stringify(currentContent));
  writeToDataFile(sendingFilePath,`var todos=${JSON.stringify(currentContent)}`);
  res.redirect('/home.html')
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
  writeToDataFile(filePath,JSON.stringify(currentContent));
  writeToDataFile(sendingFilePath,`var todos=${JSON.stringify(currentContent)}`);
  res.redirect('/showSingleToDo');
};

const editTodo=(req,res)=>{
  let title=req.body.title;;
  let description=req.body.description;
  let items=querystring.unescape(req.body.items).split('\r\n');
  items=items.filter(function (item) {
    return item!="";
  });
  let allToDos=getAllToDo(req);
  res.end();
};

app.get('/',function(req,res){
  if (req.user) {
    res.redirect('/home.html');
    return;
    // req.url='/home.html';
    // console.log(req);
    // serveStaticPage(req,res);
  }
  res.redirect('/login.html');
});
app.get('/deleteToDo',deleteToDo);
app.get('/showSingleToDo',showSingleToDo);
app.get('/login.html',serveLoginPage);
app.get('/logout',logoutUser);
app.post('/addNewTodo',addNewTodo);
app.post('/login',verifyLogin);
app.post('/addNewItem',addNewItem);
app.post('/edit',editTodo);

module.exports=app;
