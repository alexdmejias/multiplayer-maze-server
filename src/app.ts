// declare function require(name: string);
require('source-map-support').install();

import * as express from 'express';
import * as http from 'http';
import * as chalk from 'chalk';

import Utils from './utils';
import {IPlayersObj, IConfig} from './_interfaces';

const playersArr: string[] = [];
const playersObj: IPlayersObj = {};


const config: IConfig = {
  scoreIncrementer: 1,
  roundDuration: 5000,
  port: 3005
}

const utils = new Utils(playersArr, playersObj, config);

const app = express();


const server = http.createServer(app);
server.listen(config.port, function() {
  console.log(chalk.bgRed.black(`listing on port: ${config.port}`));
});

const io = require('socket.io')(server);

io.on('connection', function (socket) {
  utils._addPlayer(socket.id);

  socket.on('disconnect', () => {
    utils._removePlayer(socket.id);
  })

  socket.on('playerScored', (data) => {
    utils._ddp('scored', socket.id);
    utils._playerScored(socket.id);
  });

  socket.on('playerChangedName', (data) => {

  });

  socket.on('systemStatus', () => {
    playersArr.forEach((player) => {
      console.log(`${player} - ${playersObj[player].currentScore}`);
    });
  });

  socket.on('gameIntermission', () => { });
  socket.on('gameStarting', () => { });
  socket.on('gameStarted', () => { });
  socket.on('gameFinishing', () => {});
  socket.on('gameFinished', () => {});
  socket.on('gameUpdating', () => {});
});
