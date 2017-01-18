// declare function require(name: string);
require('source-map-support').install();

import * as express from 'express';
import * as http from 'http';
import * as chalk from 'chalk';

const app = express();

let port = 3005;

const server = http.createServer(app);
server.listen(port, function() {
  console.log(chalk.bgRed.black(`listing on port: ${port}`));
});

const io = require('socket.io')(server);

const playersConnected: string[] = [];
const playersConnectedObj = {};

function _removePlayer (playerId: string): boolean {
  const playerIdIndex: number = playersConnected.indexOf(playerId);

  if ( playerIdIndex > -1) {
    playersConnected.splice(playerIdIndex, 1);

    if (playersConnectedObj[playerId]) {
      delete playersConnectedObj[playerId];
      console.log(chalk.bgGreen(`player:disconnected - ${playerId}`));
      
      return true;
    } else {
      console.log(chalk.bgYellow.black(`failed to remove player 1`));
      return false;
    }
  } else {
    console.log(chalk.bgYellow.black(`failed to remove player 2`));
    return false;
  }

}

function _addPlayer (playerId: string) {
  if (playersConnected.indexOf(playerId) < 0) {
    playersConnected.push(playerId);

    if (!playersConnectedObj[playerId]) {
      playersConnectedObj[playerId] = {};

      console.log(chalk.bgGreen(`player:connected - ${playerId}`));
      return true;
    } else {
      console.log(chalk.bgYellow.black(`failed to add player`));
      return false;
    }
    
  } else {
    console.log(chalk.bgYellow.black(`failed to add player`));
    return false;
  }
}

io.on('connection', function (socket) {
  _addPlayer(socket.id);

  socket.on('disconnect', () => {
    _removePlayer(socket.id);
  })

  socket.on('playerScored', (data) => {
    console.log(chalk.bgGreen(`player:scored - ${socket.id}`));
  });
});
