const http = require('http');
let app = require('./app.js');
const PORT=8004;
let server=http.createServer(app);
server.listen(PORT);
console.log(`Listening to port ${PORT}.......`);
