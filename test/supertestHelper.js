const assert = require('chai').assert;
const supertestHelper = {};

supertestHelper.should_have_cookie = function(res,specificCookie) {
  let cookies = res.headers['set-cookie'].join('');
  assert.isOk(cookies.includes(specificCookie));
}

supertestHelper.should_not_have_cookie = function(res,specificCookie) {
  let cookies = res.headers['set-cookie'].join('');
  assert.isNotOk(cookies.includes(specificCookie));
}

supertestHelper.body_does_not_contain = function(res,text) {
  let body = res.text;
  assert.isNotOk(body.includes(text));
}

module.exports = supertestHelper;
