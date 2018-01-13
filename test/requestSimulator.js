let EventEmitter = require('events');
let request = function(app,options,onComplete){
  let res_headers = {};
  let res_contents = "";
  let req = new EventEmitter();
  req.method = options.method;
  req.url = options.url;
  req.headers = options.headers||{};
  let res={
    end:()=>{
      res.finished = true;
      let result = {
        statusCode:res.statusCode||200,
        headers:res_headers,
        body:res_contents
      };
      onComplete(result);
    },
    setHeader:(key,value)=> res_headers[key] = value,
    write:(text)=>res_contents+=text
  };
  app(req,res);
  options.body && req.emit('data',options.body);
  req.emit('end');
}
module.exports = request;
