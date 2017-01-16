// declare function require(name: string);
require('source-map-support').install();

import * as express from 'express';
import * as http from 'http';

const app = express();

// Start server
let port = 3005;

const server = http.createServer(app);
server.listen(port, function() {
  console.log('listing on port: ' + port);
});

const io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
