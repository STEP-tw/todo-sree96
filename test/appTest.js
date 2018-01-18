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
  describe('GET /addNewTodo.html', function(){
      it('serves an addNewTodo page if loggedin', function(done){
      request(app,{method:'GET',url:'/addNewTodo.html',user:{userName:'sree',name:'sreenadh',password:"password"}},res=>{
        th.status_is_ok(res);
        th.content_type_is(res,'text/html');
        th.body_contains(res,"Description: ");
        th.body_contains(res,"Logout");
        th.body_contains(res,"Home");
        done();
      });
    });
      it('serves an addNewTodo page if loggedin', function(done){
      request(app,{method:'GET',url:'/addNewTodo.html'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        done();
      });
    });
  });

});
