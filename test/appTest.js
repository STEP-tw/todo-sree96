let chai = require('chai');
let assert = chai.assert;
let request = require('supertest');
let app = require('../app.js');
let realApp = require('../app.js');
let th = require('./testHelper.js');
let sth = require('./supertestHelper.js');
let MockFileSystem = require('./mockFileSystem.js');
let dummySessionIdGenerator = require('./mockSessionId.js')

let dummyFs = new MockFileSystem();

dummyFs.addFile('./public/fileNotFound.html','Requested File Not Found');
dummyFs.addFile('./public/js/home.js','addEventListenerToAllButtons');
dummyFs.addFile('./public/showSingleToDo.html','This is title, Item1, Sleep')
dummyFs.addFile('./request.log','');
dummyFs.addFile('./public/home.html','This is HOME PAGE pranavb');
dummyFs.addFile('./public/login.html','Login');

app.fs = dummyFs;

app.sessionidGenerator=dummySessionIdGenerator;

describe('GET /bad', function(){
  it('should redirect to login page if not loggedin for /bad', function(done){
    request(app)
      .get('/bad')
      .expect(/Cannot GET/)
      .expect(404)
      .end(done)
  });

  it('should redirect to file not found page if loggedin', function(done){
    request(app)
      .get('/bad')
      .expect(/Cannot GET/)
      .expect(404)
      .end(done)
  });
});

describe('GET /js/home.js', function(){
  it('should serve home.js', function(done){
    request(app)
      .get('/js/home.js')
      .expect(/addEventListenerToAllButtons/)
      .expect(200)
      .end(done)
  });
});

describe('GET /', function(){
  it('should redirect to login page if not loggedin', function(done){
    request(app)
      .get('/')
      .expect(302)
      .expect('Location','/loginPage')
      .end(done);
  });
  it('should redirect to home page if request contains a valid user', function(done){
    request(app)
      .post('/login')
      .send('userName=pranavb&password=password')
      .expect(302)
      .expect('Location','/homePage')
      .end(()=>{request(app)
        .get('/')
        .set('cookie','sessionid=1234')
        .expect(302)
        .expect('Location','/homePage')
        .end(done)})
  });
});

describe('GET /loginPage', function(){
  it('should serve the login page for /loginPage', function(done){
    request(app)
      .get('/loginPage')
      .expect(200)
      .expect(/Login/)
      .end(done);
  });
  it('should serve the home page for /loginPage if already logged in', function(done){
    request(app)
      .post('/login')
      .send('userName=pranavb&password=password')
      .expect(302)
      .expect('Location','/homePage')
      .end(()=>{request(app)
        .get('/loginPage')
        .set('cookie','sessionid=1234')
        .expect(302)
        .expect('Location','/homePage')
        .end(done)})
  });
});

describe('POST /login', function(){
  it('redirects to home page for valid user with default cookie',function(done) {
    request(app)
      .post('/login')
      .send('userName=pranavb&password=password')
      .expect((res)=>{sth.should_have_cookie(res,'sessionid=1234')})
      .expect(302)
      .expect('Location','/homePage')
      .end(done);
  })

  it('redirects to loginPage with message for invalid user',function(done) {
    request(app)
      .post('/login')
      .send('userName=badUser')
      .expect((res)=>{sth.should_have_cookie(res,'message=Login Failed')})
      .expect(302)
      .expect('Location','/loginPage')
      .end(done);
  })

  it('should serve the login page with message if cookie found', function(done){
    request(app)
      .get('/loginPage')
      .set('cookie','message=Login Failed')
      .expect(200)
      .expect(/Login Failed/)
      .end(done);
  })
});

describe('POST /login', function(){
  it('redirects to home page for valid user with dummy sessionid',function(done) {
    request(app)
      .post('/login')
      .send('userName=pranavb&password=password')
      .expect((res)=>{sth.should_have_cookie(res,'sessionid=1234')})
      .expect(302)
      .expect('Location','/homePage')
      .end(done);
  });
});

describe('GET /logout', function(){
  it('redirects to login page after logout',function(done) {
    request(app)
      .post('/login')
      .send('userName=pranavb&password=password')
      .expect((res)=>{sth.should_have_cookie(res,'sessionid=1234')})
      .expect(302)
      .expect('Location','/homePage')
      .end(()=>{
        request(app)
          .get('/logout')
          .set('cookie','sessionid=1234')
          .expect(302)
          .expect('Location','/loginPage')
          .end(done);
      });
  });
});

describe('GET /homePage', function(){
  it('serves to home page if loggedin',function(done) {
    request(app)
      .post('/login')
      .send('userName=pranavb&password=password')
      .end(()=>{
        request(app)
          .get('/homePage')
          .set('cookie','sessionid=1234')
          .expect(200)
          .expect(/HOME/)
          .end(done);
    });
  });

  it('redirects to login page if not loggedin',function(done) {
    request(app)
      .post('/homePage')
      .expect(302)
      .expect('Location','/loginPage')
      .end(done)
  })
});

describe('/addNewTodo', function(){
  it('should add a new todo to all todos', function(done){
    request(app)
      .post('/login')
      .send('userName=pranavb&password=password')
      .end(()=>{
        request(app)
          .post('/addNewTodo')
          .set('cookie','sessionid=1234')
          .send('title=This is title&description=nice')
          .expect(302)
          .expect('Location','/homePage')
          .end(done)
      })
  });
});

describe('/showSingleToDo', function(){
  beforeEach(function(done){
    request(app)
      .post('/login')
      .send('userName=pranavb&password=password')
      .end(done);
  });

  it('create new todo', function(done){
    request(app)
      .post('/addNewTodo')
      .set('cookie','sessionid=1234')
      .send('title=This is title&description=nice')
      .expect(302)
      .expect('Location','/homePage')
      .end(done)
  });
  it('should show a todo from all todos', function(done ){
    request(app)
      .post('/addNewTodo')
      .set('cookie','sessionid=1234')
      .send('title=This is title&description=nice')
      .expect(302)
      .expect('Location','/homePage')
      .end(()=>{
        request(app)
          .get('/showSingleToDo')
          .set('cookie','sessionid=1234;currentToDo=This is title')
          .expect(/This is title/)
          .end(done)
      })
  });
});

describe('Testing for features available for loggedin users', function(){
  beforeEach(function(done){
    request(app)
      .post('/login')
      .send('userName=pranavb&password=password')
      .end(()=>{
        request(app)
          .post('/addNewTodo')
          .send('title=This is title')
          .set('cookie','sessionid=1234')
          .end(()=>{
            request(app)
              .post('/addNewItem')
              .set('cookie','sessionid=1234;currentToDo=This is title')
              .send('item=Item1')
              .end(done)
          })
      })
  });

  describe('/addNewItem', function(){
    it('adding newitem into an existing todo', function(done){
      request(app)
        .post('/addNewItem')
        .set('cookie','sessionid=1234;currentToDo=This is title')
        .send('item=Item1')
        .end(()=>{
          request(app)
            .get('/showSingleToDo')
            .set('cookie','sessionid=1234;currentToDo=This is title')
            .expect(/Item1/)
            .expect(/This is title/)
            .end(done)
        });
    });
  });

  describe('/deleteToDo', function(){
    it('should delete a todo', function(done){
      request(app)
        .get('/deleteToDo')
        .set('cookie','sessionid=1234;currentToDo=This is title')
        .expect('Location','/homePage')
        .expect(302)
        .end(()=>{
          request(app)
            .get('/homePage')
            .set('cookie','sessionid=1234')
            .expect((res)=>{sth.body_does_not_contain(res,"This is title")})
            .end(done)
        })
    });
  });

  describe('/deleteItem', function(){
    it('should show a todo from all todos', function(done ){
      request(app)
        .post('/addNewItem')
        .set('cookie','sessionid=1234;currentToDo=This is title')
        .send('item=Item1')
        .end(()=>{
          request(app)
            .post('/deleteItem')
            .set('cookie','sessionid=1234;currentToDo=This is title')
            .send('item=Item2')
            .end(()=>{
              request(app)
                .get('/showSingleToDo')
                .set('cookie','sessionid=1234;currentToDo=This is title')
                .expect(200)
                .expect((res)=>{sth.body_does_not_contain(res,"Item2")})
                .end(done)
            })
        })
    });
  });

  describe('parse cookies', function(){
    it('should return empty object for invalid cookies', function(done){
      request(app)
        .get('/homePage')
        .set("cookie","gdgdgcgc;;;dbdg;")
        .expect((res)=>{console.log(res.cookies);})
        .end(done)
    });
  });

  describe('/updateItemStatus', function(){
    it('should edit item status', function(done ){
      request(app)
        .post('/updateItemStatus')
        .set('Cookie','currentToDo = This is title;sessionid=1234')
        .send('item=Item1&itemStatus=true')
        .expect(/{"desc":"Item1","checkedValue":true}/)
        .end(()=>{
          request(app)
            .post('/updateItemStatus')
            .set('Cookie','currentToDo = This is title;sessionid=1234')
            .send('item=Item1&itemStatus=false')
            .expect(/{"desc":"Item1","checkedValue":false}/)
            .end(done);
        })
    })
  });

  describe('/editTitle', function(){
    it('should edit the current title of todo', function(done){
      request(app)
        .post('/editTitle')
        .set('Cookie','currentToDo = This is title;sessionid=1234')
        .send('newTitle=Sleep')
        .end(()=>{
          request(app)
            .get('/showSingleToDo')
            .set('Cookie','currentToDo = Sleep;sessionid=1234')
            .expect(/Sleep/)
            .expect(200)
            .end(done)
        })
    });
    it('should edit the current title of todo if same title is given', function(done){
      request(app)
        .post('/editTitle')
        .set('Cookie','currentToDo = This is title;sessionid=1234')
        .send('newTitle=This is title')
        .end(()=>{
          request(app)
            .get('/showSingleToDo')
            .set('Cookie','currentToDo = This is title;sessionid=1234')
            .expect(/Sleep/)
            .expect(200)
            .end(done)
        })
    });
  });
});
