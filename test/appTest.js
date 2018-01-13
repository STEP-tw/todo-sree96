let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let app = require('../app.js');
let th = require('./testHelper.js');

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with login page when not logged in for any url',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,302);
        done();
      })
    })
  })
  describe('GET /',()=>{
    it('redirects to index.html',done=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        th.should_be_redirected_to(res,'/login.html');
        assert.equal(res.body,"");
        done();
      })
    })
  })
  describe('GET /home.html',()=>{
    it('gives the index page',done=>{
      request(app,{method:'GET',url:'/home.html'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        done();
      })
    })
  })
  describe.skip('GET /js/todos.js',()=>{
    it('serves the javascript source',done=>{
      request(app,{method:'GET',url:'/js/todos.js'},res=>{
        th.status_is_ok(res);
        th.content_type_is(res,'text/javascript');
        th.body_contains(res,'todos');
        done();
      })
    })
  })
  describe('GET /login.html',()=>{
    it('serves the login page',done=>{
      request(app,{method:'GET',url:'/login.html'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'User Name:');
        th.body_does_not_contain(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
    it('serves the login page with message for a failed login',done=>{
      request(app,{method:'GET',url:'/login.html',headers:{'cookie':'message=login failed'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'User Name:');
        th.body_contains(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })

  describe.skip('POST /login',()=>{
    it('redirects to guestBook for valid user',done=>{
      request(app,{method:'POST',url:'/login',body:'username=arvind'},res=>{
        th.should_be_redirected_to(res,'/guestBook');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
    it('redirects to login.html with message for invalid user',done=>{
      request(app,{method:'POST',url:'/login',body:'username=badUser'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        th.should_have_expiring_cookie(res,'message','login failed');
        done();
      })
    })
  })
})
