require('source-map-support').install();

import * as express from 'express';
import * as http from 'http';
import * as chalk from 'chalk';

import config from './config';
import Utils from './utils';
import {IPlayersObj, IConfig} from './_interfaces';

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const playersArr: string[] = [];
const playersObj: IPlayersObj = {};

const utils = new Utils(playersArr, playersObj, config);

server.listen(config.port, function() {
  console.log(chalk.bgRed.black(`listing on port: ${config.port}`));
});

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
