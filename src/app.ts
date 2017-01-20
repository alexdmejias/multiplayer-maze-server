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

const enum possibleGameStates {
  'intermission',
  'starting',
  'started',
  'finishing',
  'finished',
};

let internalState: possibleGameStates = possibleGameStates.intermission;
let internalClock: NodeJS.Timer;

// function init () {
//   internalClock = setTimeout(() => {
//     if (internalState === possibleGameStates.intermission) {
//       internalState++;
//     }
//   }, config.durationRound);
// }

function newConnectionInit (socket) {
  utils._addPlayer(socket.id);

  switch (internalState) {
    case possibleGameStates.intermission:
      // emit partial maze
    break;

    case possibleGameStates.starting:
      // emit last digits to decrypt maze
    break;

    default:
  }
}

server.listen(config.port, function() {
  console.log(chalk.bgRed.black(`listing on port: ${config.port}`));
  // init();
});

io.on('connection', function (socket) {
  newConnectionInit(socket);

  socket.on('disconnect', () => {
    utils._removePlayer(socket.id);
  });

  socket.on('playerScored', (data) => {
    utils._ddp('scored', socket.id);
    utils._playerScored(socket.id);
  });

  socket.on('playerChangedName', (data) => {
    utils._changePlayerAttr(socket.id, 'username', data.newName);
  });

  socket.on('systemStatus', () => {
    playersArr.forEach((player) => {
      console.log(`${player} - ${playersObj[player].currentScore}`);
    });
  });

  // socket.on('gameIntermission', () => { });
  // socket.on('gameStarting', () => { });
  // socket.on('gameStarted', () => { });
  // socket.on('gameFinishing', () => {});
  // socket.on('gameFinished', () => {});
  // socket.on('gameUpdating', () => {});
});

// function _getNextState(currentState: possibleGameStates): number {
//   if (currentState === possibleGameStates.finished) {
//     return possibleGameStates.intermission;
//   } else {
//     return currentState + 1;
//   }
// }
