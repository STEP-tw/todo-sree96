const fs = require('fs');
const WebApp = require('./webapp');
let handlerLib = require('./handlerLib.js');

let app=WebApp.create();

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

app.use(handlerLib.logRequest)
app.use(handlerLib.loadUser);
app.use(handlerLib.redirectLoggedInUserToHome);
app.use(handlerLib.redirectLoggedOutUserToLogin);
app.use(markAsDone);
app.use(markAsNotDone);

app.addPostprocess(gotoToDo);
app.addPostprocess(handlerLib.serveStaticPage);


app.get('/',function(req,res){
  if (req.user) {
    res.redirect('/home.html');
    return;
  }
  res.redirect('/login.html');
});
app.get('/home.html',handlerLib.serveHomePage);
app.get('/deleteToDo',handlerLib.deleteToDo);
app.get('/showSingleToDo',handlerLib.showSingleToDo);
app.get('/login.html',handlerLib.serveLoginPage);
app.get('/logout',handlerLib.logoutUser);
app.post('/addNewTodo',handlerLib.addNewTodo);
app.post('/login',handlerLib.verifyLogin);
app.post('/addNewItem',handlerLib.addNewItem);
app.post('/edit',handlerLib.editTodo);
app.post('/deleteItem',handlerLib.deleteItemAndGetUpdatedList);

module.exports=app;
