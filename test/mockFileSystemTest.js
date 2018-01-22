const assert = require('chai').assert;
const MockFS = require('./MockFileSystem.js');

describe('fs', function(){
  let fs = new MockFS()
  it('addFile', function(){
    fs.addFile('index.html','This is index.html');
  });

  it('existSync', function(){
    assert.isOk(fs.existSync('index.html'));
    assert.isNotOk(fs.existSync('Patel'));
  });

  it('readFileSync', function(){
    assert.equal(fs.readFileSync('index.html','utf8'),'This is index.html');
  });

});
