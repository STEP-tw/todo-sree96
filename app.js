const fs = require('fs');
const WebApp = require('./webapp');
let handlerLib = require('./handlerLib.js');

let app=WebApp.create();


app.use(handlerLib.logRequest)
app.use(handlerLib.loadUser);
app.use(handlerLib.redirectLoggedInUserToHome);
app.use(handlerLib.redirectLoggedOutUserToLogin);


app.addPostprocess(handlerLib.serveStaticPage);

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
