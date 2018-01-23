let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.sessionid = '1234';
let app = require('../app.js');
let th = require('./testHelper.js');
let MockFileSystem = require('./mockFileSystem.js');
let dummyFs = new MockFileSystem();

dummyFs.addFile('./public/fileNotFound.html','Requested File Not Found');
dummyFs.addFile('./public/js/home.js','addEventListenerToAllButtons');
dummyFs.addFile('./public/showSingleToDo.html','This is title, Item1, Sleep')
dummyFs.addFile('./request.log','');
dummyFs.addFile('./public/home.html','This is HOME PAGE pranavb');
dummyFs.addFile('./public/login.html','Login');


app.fs = dummyFs;

describe('GET /bad', function(){
  it('Should redirect to login page if not loggedin for /bad', function(done){
    request(app,{method:'GET',url:'/bad'},(res)=>{
      th.body_contains(res,"Requested File Not Found");
      th.content_type_is(res,'text/html');
      assert.equal(res.statusCode,404);
      done();
    });
  });

  it('Should redirect to file not found page if loggedin', function(done){
      request(app,{method:'GET',url:'/bad',user:{userName:'sree',name:'sreenadh',password:"password"}},(res)=>{
      th.body_contains(res,"Requested File Not Found");
      th.content_type_is(res,'text/html');
      assert.equal(res.statusCode,404);
      done();
    });
  });
});

describe('GET /js/home.js', function(){
  let req={method:'GET',url:'/js/home.js',user:{userName:'sree',name:'sreenadh',password:"password"}};
  it('should serve home.js', function(done){
    request(app,req,res=>{
      th.status_is_ok(res);
      th.body_contains(res,'addEventListenerToAllButtons');
      done();
    })
  });
});

describe('GET /', function(){
  it('Should redirect to login page if not loggedin', function(done){
    request(app,{method:'GET',url:'/'},(res)=>{
      th.should_be_redirected_to(res,'/login.html');
      done();
    });
  });
  it('Should redirect to home page if request contains a valid user', function(done){
    request(app,{method:'GET',url:'/',user:{userName:'sree',name:'sreenadh',password:"password"}},(res)=>{
      th.should_be_redirected_to(res,'/home.html');
      done();
    });
  });
});

describe('GET /login.html', function(){
  it('Should serve the login page for /login.html', function(done){
    request(app,{method:'GET',url:'/login.html'},(res)=>{
      th.status_is_ok(res);
      th.content_type_is(res,'text/html');
      th.body_contains(res,"Login");
      done();
    });
  });
  it('Should serve the home page for /login.html if already logged in', function(done){
    request(app,{method:'GET',url:'/login.html',user:{userName:'sree',name:'sreenadh',password:"password"}},(res)=>{
      th.should_be_redirected_to(res,'/home.html');
      done();
    });
  });
});

describe('POST /login', function(){
  it('redirects to home page for valid user',done=>{
    request(app,{method:'POST',url:'/login',body:'userName=pranavb&password=password'},res=>{
      th.should_be_redirected_to(res,'/home.html');
      th.should_not_have_cookie(res,'message');
      th.should_have_cookie(res,'sessionid','1234')
      done();
    })
  });
  it('redirects to login.html with message for invalid user',done=>{
    request(app,{method:'POST',url:'/login',body:'userName=badUser'},res=>{
      th.should_be_redirected_to(res,'/login.html');
      th.should_have_expiring_cookie(res,'message','Login Failed');
      done();
    })
  });
  it('Should serve the login page with message if cookie found', function(done){
    request(app,{method:'GET',url:'/login.html',headers:{cookie:'message=Login Failed'}},(res)=>{
      th.status_is_ok(res);
      th.content_type_is(res,'text/html');
      th.body_contains(res,"Login Failed");
      done();
    });
  });
});

describe('GET /logout', function(){
  it('redirects to login page after logout',done=>{
    request(app,{method:'GET',url:'/logout',headers:{cookie:"sessionid=1234"}},res=>{
      th.should_be_redirected_to(res,'/login.html');
      th.should_have_cookie(res,'sessionid',0);
      done();
    })
  });
});

describe('GET /home.html', function(){
  it('serves to home page if loggedin',done=>{
    request(app,{method:'GET',url:'/home.html',user:{userName:'pranavb',name:'pranavb',password:'password'}},res=>{
      th.status_is_ok(res);
      th.content_type_is(res,'text/html');
      th.body_contains(res,"HOME PAGE");
      th.body_contains(res,'pranavb');
      done();
    })
  });
  it('redirects to login page if not loggedin',done=>{
    request(app,{method:'GET',url:'/home.html'},res=>{
      th.should_be_redirected_to(res,'/login.html');
      done();
    })
  });
});

describe('/addNewTodo', function(){
  it('should add a new todo to all todos', function(done ){
    let req = {method:'POST',url:'/addNewTodo',user:{userName:'pranavb',name:'pranavb',password:'password'},body:'title=This is title&description=nice'}
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/home.html');
      done();
    })
  });
});

describe('/showSingleToDo', function(){
  let req = {method:'POST', url:'/addNewTodo', user:{userName:'pranavb',name:'pranavb',password:'password'}, body:'title=This is title',headers:{cookie:"sessionid=1234"}};
  it('create new todo', function(done){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/home.html');
      req['url']='/showSingleToDo';
      req['method'] = "GET";
      req.headers['cookie']='currentToDo = This is title';
      done();
    });
  });
  it('should show a todo from all todos', function(done ){
    request(app,req,res=>{
      th.body_contains(res,'This is title');
      th.status_is_ok(res);
      done();
    })
  });
});

describe('/addNewItem', function(){
  let req = {method:'POST', url:'/addNewTodo', user:{userName:'pranavb',name:'pranavb',password:'password'}, body:'title=This is title',headers:{cookie:"sessionid=1234"}};
  it('create new todo', function(done){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/home.html');
      req['url']='/showSingleToDo';
      req['method'] = "GET";
      req.headers['cookie']='currentToDo = This is title';
      done();
    });
  });
  it('should show a todo from all todos', function(done ){
    request(app,req,res=>{
      th.body_contains(res,'This is title');
      th.status_is_ok(res);
      req['url']='/addNewItem';
      req['method']='POST';
      req['body']='item=Item1';
      done();
    })
  });
  it('should add a newItem to a todo', function(done ){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/showSingleToDo');
      req['url']='/showSingleToDo';
      req['method']='GET'
      req.headers['cookie']='currentToDo = This is title';
      done();
    })
  });
  it('should show the newly added item', function(done){
    request(app,req,res=>{
      th.body_contains(res,'Item1')
    })
    done();
  });

});

describe('/deleteToDo', function(){
  let req = {method:'POST', url:'/addNewTodo', user:{userName:'pranavb',name:'pranavb',password:'password'}, body:'title=This is title',headers:{cookie:"sessionid=1234"}};
  it('create new todo', function(done){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/home.html');
      req['url']='/deleteToDo';
      req['method'] = "GET";
      req.headers['cookie']='currentToDo = This is title';
      done();
    });
  });
  it('should delete a todo from all todos', function(done ){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/home.html');
      th.body_does_not_contain(res,"This is title")
      done();
    })
  });
});

describe('/deleteItem', function(){
  let req = {method:'POST', url:'/addNewTodo', user:{userName:'pranavb',name:'pranavb',password:'password'}, body:'title=This is title',headers:{cookie:"sessionid=1234"}};
  it('create new todo', function(done){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/home.html');
      req['url']='/showSingleToDo';
      req['method'] = "GET";
      req.headers['cookie']='currentToDo = This is title';
      done();
    });
  });
  it('should show a todo from all todos', function(done ){
    request(app,req,res=>{
      th.body_contains(res,'This is title');
      th.status_is_ok(res);
      req['url']='/addNewItem';
      req['method']='POST';
      req['body']='item=Item1';
      done();
    })
  });
  it('should add a newItem to a todo', function(done ){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/showSingleToDo');
      req['url']='/showSingleToDo';
      req['method']='GET'
      req.headers['cookie']='currentToDo = This is title';
      done();
    })
  });
  it('should show the newly added item', function(done){
    request(app,req,res=>{
      th.body_contains(res,'Item1')
    })
    req['url']='/deleteItem';
    req['method']="POST"
    req['body']="item=Item1";
    done();
  });
  it('should delete item from ToDo', function(done){
    request(app,req,res=>{
      th.body_does_not_contain(res,'Item1')
      done();
    })
  });
});

describe('parse cookies', function(){
  it('should return empty object for invalid cookies', function(){
    let req = {method:'get', url:'/home.html', headers:{cookie:"jfd9jr9etji34;;98"}};
    request(app,req,res=>{

    })
  });
});

describe('/updateItemStatus', function(){
  let req = {method:'POST', url:'/addNewTodo', user:{userName:'pranavb',name:'pranavb',password:'password'}, body:'title=This is title',headers:{cookie:"sessionid=1234"}};
  it('create new todo', function(done){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/home.html');
      req['url']='/showSingleToDo';
      req['method'] = "GET";
      req.headers['cookie']='currentToDo = This is title';
      done();
    });
  });
  it('should show a todo from all todos', function(done ){
    request(app,req,res=>{
      th.body_contains(res,'This is title');
      th.status_is_ok(res);
      req['url']='/addNewItem';
      req['method']='POST';
      req['body']='item=Item1';
      req.headers['cookie']='currentToDo = This is title';
      done();
    })
  });
  it('should add a newItem to a todo', function(done ){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/showSingleToDo');
      req['url']='/updateItemStatus';
      req['method']='POST';
      req.headers['cookie']='currentToDo = This is title';
      req['body'] = 'item=Item1&itemStatus=true';
      done();
    })
  });
  it('shoud update the status of item', function(done){
    request(app,req,res=>{
      th.body_contains(res,`{"desc":"Item1","checkedValue":true}`);
      req['url']='/updateItemStatus';
      req['method']='POST';
      req.headers['cookie']='currentToDo = This is title';
      req['body'] = 'item=Item1&itemStatus=false'
      done();
    })
  });
  it('shoud update the status of item', function(done){
    request(app,req,res=>{
      th.body_contains(res,`{"desc":"Item1","checkedValue":false}`);
      done();
    })
  });
});

describe('/editTitle', function(){
  let req = {method:'POST', url:'/addNewTodo', user:{userName:'pranavb',name:'pranavb',password:'password'}, body:'title=This is title',headers:{cookie:"sessionid=1234"}};
  it('create new todo', function(done){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/home.html');
      req['url']='/showSingleToDo';
      req['method'] = "GET";
      req.headers['cookie']='currentToDo = This is title';
      done();
    });
  });

  it('should show a todo from all todos', function(done ){
    request(app,req,res=>{
      th.body_contains(res,'This is title');
      th.status_is_ok(res);
      req['url']='/editTitle';
      req['method']='POST';
      req['body']='newTitle=Sleep';
      req.headers['cookie']='currentToDo = This is title';
      done();
    })
  });
  it('should edit the current title of todo', function(done){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/showSingleToDo');
      req['url']='/showSingleToDo';
      req['method'] = "GET";
      req.headers['cookie']='currentToDo = Sleep';
      done();
    })
  });
  it('should show a todo from all todos', function(done ){
    request(app,req,res=>{
      th.body_contains(res,'Sleep');
      th.status_is_ok(res);
      req['url']='/editTitle';
      req['method']='POST';
      req['body']='newTitle=Sleep';
      req.headers['cookie']='currentToDo = Sleep';
      done();
    })
  });
  it('should edit the current title of todo', function(done){
    request(app,req,res=>{
      th.should_be_redirected_to(res,'/showSingleToDo');
      req['url']='/showSingleToDo';
      req['method'] = "GET";
      req.headers['cookie']='currentToDo = Sleep';
      done();
    })
  });
  it('should show a todo from all todos', function(done ){
    request(app,req,res=>{
      th.body_contains(res,'Sleep');
      th.status_is_ok(res);
      done();
    });
  });
});
