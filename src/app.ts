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

import Grid from './mazes/grid';
import algos from './mazes/algos';

const gridSize = 10;

const maze = new Grid(gridSize, gridSize, algos['Binary']);

const mazeConnections = maze.allCellConnectionsAsStr();
const mazeConnectionsSplitIndex: number = -1 * (gridSize + 1);

const mazeConnectionsPublic = mazeConnections.slice(0, mazeConnectionsSplitIndex);
const mazeConnectionsSecret = mazeConnections.slice(mazeConnectionsSplitIndex);

const possibleGameStates = [
  'intermission',
  'starting',
  'started',
  'finishing',
  'finished',
];

function intermissionCallback (specificPlayerId?: string) {
  console.log('you are in the intermission state')
}

function startingCallback (specificPlayerId?: string) {
  console.log('you are in the starting state')
}

function startedCallback (specificPlayerId?: string) {
  console.log('you are in the started state')
}

function finishingCallback (specificPlayerId?: string) {
  console.log('you are in the finishing state')
}

function finishedCallback (specificPlayerId?: string) {
  console.log('you are in the finished state')
}
// -------------------------- //
const possibleGameStatesOptions = {
  'intermission': {
    duration: 2000,
    callback: (specificPlayerId?: string) => {
      intermissionCallback(specificPlayerId);
    }
  },
  'starting': {
    duration: 2000,
    callback: (specificPlayerId?: string) => {
      startingCallback(specificPlayerId);
    }
  },
  'started': {
    duration: 2000,
    callback: (specificPlayerId?: string) => {
      startedCallback(specificPlayerId);
    }
  },
  'finishing': {
    duration: 2000,
    callback: (specificPlayerId?: string) => {
      finishingCallback(specificPlayerId);
    }
  },
  'finished': {
    duration: 2000,
    callback: (specificPlayerId?: string) => {
      finishedCallback(specificPlayerId);
    }
  }
}

let internalState: string = possibleGameStates[0];
let internalClock;

function executeGameStateChange (currentState: string) {

  const nextState: string = getNextGameStateName(getGameStateIndex(currentState));
  const currentStateOptions = possibleGameStatesOptions[currentState];

  console.log(currentState, '<<<<<<')

  if (currentStateOptions.callback) {
    currentStateOptions.callback();
  }

  internalClock = setTimeout(() => {
    setGameState(nextState);
    executeGameStateChange(nextState);
  }, 5000);
}

function setGameState (newGameState: string) {
  internalState = newGameState;
}

function getGameStateIndex (state: string): number {
  return possibleGameStates.indexOf(state);
}

function getCurrGameStateIndex (): number {
  return possibleGameStates.indexOf(possibleGameStates[internalState]);
}

function getCurrGameStateName (): string {
  return internalState;
}

function getNextGameState (currentState: number): number {
  const amountOfGameStates: number = possibleGameStates.length;

  if (currentState === (amountOfGameStates - 1)) {
    return 0;
  } else {
    return currentState + 1;
  }
}

function getNextGameStateName (currentState: number): string {
  const nextStateIndex = getNextGameState(currentState);

  return possibleGameStates[nextStateIndex];
}

function init () {
  executeGameStateChange(internalState)
}

function newConnectionInit (socket) {
  utils._addPlayer(socket.id);
  const currentState = getCurrGameStateName();
  const currentStateOptions = possibleGameStatesOptions[currentState];

  if (currentStateOptions.callback) {
    currentStateOptions.callback(socket.id);
  }
  // socket.emit('mazeArrival', {maze: mazeConnectionsPublic});
  // console.log(maze.print())
  // console.log(mazeConnections);

  // setTimeout(() => {
  //   socket.emit('mazeArrival', {secret: true, maze: mazeConnectionsSecret});
  // }, 2000);

}







server.listen(config.port, function() {
  console.log(chalk.bgRed.black(`listing on port: ${config.port}`));
  init();
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
