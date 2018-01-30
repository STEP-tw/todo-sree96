const fs = require('fs');
const express = require('express');
const handlerLib = require('./handlerLib.js');
const sessionidGenerator = require('./utils').sessionidGenerator;

const parser = express.urlencoded({
  extended : false,
  type : req=>true
})

const toKeyValue = kv=>{
    let parts = kv.split('=');
    return {key:parts[0].trim(),value:parts[1].trim()};
};

const accumulate = (o,kv)=> {
  o[kv.key] = kv.value;
  return o;
};

const parseCookies = text=> {
  try {
    return text && text.split(';').map(toKeyValue).reduce(accumulate,{}) || {};
  }catch(e){
    return {};
  }
}

const cookieParser=function (req,res,next) {
  req.cookies=parseCookies(req.headers.cookie||'');
  next();
}

let app=express();

app.sessionidGenerator = sessionidGenerator;
app.fs = fs;

app.use(parser);
app.use(cookieParser);
app.use(handlerLib.logRequest.bind(app));
app.use(handlerLib.loadUser);
app.use(handlerLib.redirectLoggedOutUserToLogin);
app.use(handlerLib.redirectLoggedInUserToHome);
app.use(express.static('public'));

app.get('/homePage',handlerLib.serveHomePage.bind(app));
app.get('/deleteToDo',handlerLib.deleteToDo);
app.get('/showSingleToDo',handlerLib.showSingleToDo.bind(app));
app.get('/loginPage',handlerLib.serveLoginPage.bind(app));
app.get('/logout',handlerLib.logoutUser);
app.post('/addNewTodo',handlerLib.addNewTodo);
app.post('/login',handlerLib.verifyLogin.bind(app));
app.post('/addNewItem',handlerLib.addNewItem);
app.post('/deleteItem',handlerLib.deleteItemAndGetUpdatedList);
app.post('/updateItemStatus',handlerLib.updateItemStatus);
app.post('/editTitle',handlerLib.editTitle);


module.exports=app;
