let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.COMMENT_STORE = "./test/testStore.json";
let app = require('../app.js');
let th = require('./testHelper.js');

describe('APP', function(){
  describe('GET /bad', function(){
    it('Should redirect to login page if not loggedin for /bad', function(done){
      request(app,{method:'GET',url:'/bad'},(res)=>{
        th.should_be_redirected_to(res,'/login.html');
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
  it('Should serve the login page with message if cookie found', function(done){
    request(app,{method:'GET',url:'/login.html',headers:{cookie:'message=Login Failed'}},(res)=>{
      th.status_is_ok(res);
      th.content_type_is(res,'text/html');
      th.body_contains(res,"Login Failed");
      done();
    });
  });
  describe('POST /login', function(){
    it('redirects to home page for valid user',done=>{
      request(app,{method:'POST',url:'/login',body:'userName=sree&password=password'},res=>{
        th.should_be_redirected_to(res,'/home.html');
        th.should_not_have_cookie(res,'message');
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
  });
  describe('GET /logout', function(){
    it('redirects to login page after logout',done=>{
      request(app,{method:'GET',url:'/logout',body:'userName=sree&password=password'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        th.should_have_cookie(res,'sessionid',0);
        done();
      })
    });
  });
  describe('GET /home.html', function(){
    it('serves to home page if loggedin',done=>{
      request(app,{method:'GET',url:'/home.html',user:{userName:'sree',name:'sreenadh',password:"password"}},res=>{
        th.status_is_ok(res);
        th.content_type_is(res,'text/html');
        th.body_contains(res,"HOME PAGE");
        th.body_contains(res,'sreenadh');
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
      let req = {method:'POST',url:'/addNewTodo',user:{userName:'sree',name:'sreenadh',password:"password"},body:'title=This is title&description=nice'}
      request(app,req,res=>{
        th.should_be_redirected_to(res,'/home.html');
        done();
      })
    });
  });
  describe('/showSingleToDo', function(){
    let req = {method:'GET',url:'/showSingleToDo',user:{userName:'sree',name:'sreenadh',password:"password"},headers:{cookie:'title=This is title'}}
    it('should show a todo from all todos', function(done ){
      request(app,req,res=>{
        th.should_be_redirected_to(res,'/showSingleToDo.html');
        req['url'] = '/js/toDoContent.js';
        done();
      })
    });
    it('should show todo (checking content)',(done)=>{
      request(app,req,res=>{
        th.body_contains(res,'This is title');
        done();
      })
    })
  });
  describe('/deleteToDo', function(){
    it('should delete a todo from all todos', function(done ){
      let req = {method:'GET',url:'/deleteToDo',user:{userName:'sree',name:'sreenadh',password:"password"},headers:{cookie:'title=This is title'}}
      request(app,req,res=>{
        th.should_be_redirected_to(res,'/viewAll.html');
        done();
      })
    });
  });
  describe('/addNewItem', function(){
    let req = {method:'POST',url:'/addNewItem',user:{userName:'sree',name:'sreenadh',password:"password"},body:'item=Item1',headers:{cookie:'title=ThisIsTitle'}}
    it('should add a newItem to a todo', function(done ){
      request(app,req,res=>{
        th.should_be_redirected_to(res,'/showSingleToDo');
        req['url']='/js/todos.js'
        done();
      })
    });
    it('Should add item to toDoContent', function(){
      request(app,req,res=>{
        th.body_contains(res,'Item1');
      })
    });
  });

  describe('/editTodo', function(){
    let req = {method:'POST',url:'/edit',user:{userName:'sree',name:'sreenadh',password:"password"},body:'title=ThisIsTitle&description=ThisIsDesc&items=Item1\r\nitem 5\r\n',headers:{cookie:'title=ThisIsTitle'}}
    it('should add a newItem to a todo', function(done ){
      request(app,req,res=>{
        th.should_be_redirected_to(res,'/showSingleToDo');
        req['url']='/js/todos.js'
        done();
      })
    });
    it('Should add item to toDoContent', function(){
      request(app,req,res=>{
        th.body_contains(res,'ThisIsDesc');
      })
    });
  });

});
