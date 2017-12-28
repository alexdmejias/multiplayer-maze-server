require('source-map-support').install();

import * as express from 'express';
import * as http from 'http';
import * as chalk from 'chalk';
import * as fsm from 'javascript-state-machine';

import config from './config';
import Utils from './utils';
import {IPlayersObj, IConfig} from './_interfaces';

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const playersArr: string[] = [];
const playersObj: IPlayersObj = {};
const utils = new Utils(playersArr, playersObj, config);

import Grid, {Algos as algos} from 'multiplayer-maze-core';

const pppp = {
  algo: 'Binary',
  size: 10
}

let internalClock;

function generateMaze (props) {
  console.log(chalk.bgMagenta.black('maze: generating'));
  const maze = new Grid(props.size, props.size, props.algo);
  const mazeConnections = maze.allCellConnectionsAsStr();
  const mazeConnectionsSplitIndex: number = -1 * (props.size + 1);
  const splitIndex: number = -1 * (props.gridSize + 1);

  return {
    connectionsPublic: mazeConnections.slice(0, mazeConnectionsSplitIndex),
    connectionsSecret: mazeConnections.slice(mazeConnectionsSplitIndex)
  };
}

let currentMaze;

enum STATES {
  INTERMISSION = 'intermission',
  STARTING = 'starting',
  STARTED = 'started',
  FINISHING = 'finishing',
  FINISHED = 'finished'
}

const DURATIONS = {
  INTERMISSION: 500000,
  STARTING: 500000,
  STARTED: 500000,
  FINISHING: 500000,
  FINISHED: 500000
}

const STATE = fsm.create({
  initial: STATES.FINISHED,
  events: [
    {name: 'stopWait', from: STATES.INTERMISSION, to: STATES.STARTING},
    {name: 'startPlay', from: STATES.STARTING, to: STATES.STARTED},
    {name: 'play', from: STATES.STARTED, to: STATES.FINISHING},
    {name: 'stopPlay', from: STATES.FINISHING, to: STATES.FINISHED},
    {name: 'startWait', from: STATES.FINISHED, to: STATES.INTERMISSION},
  ],
  callbacks: {
    'onstopWait': () => {
      console.log(chalk.bgMagenta.black('maze: transmitting secret'));
      // io.emit(`state${STATE.current}`);
      io.emit('mazeArrival', {secret: true, maze: currentMaze.connectionsSecret});
    },
    'onstartPlay': () => {
      // io.emit(`state${STATE.current}`);
    },
    'onplay': () => {
      // io.emit(`state${STATE.current}`);
    },
    'onstopPlay': () => {
      // io.emit(`state${STATE.current}`);
      io.emit('mazeFinished');
    },
    'onstartWait': () => {
      currentMaze = generateMaze(pppp);
      console.log(chalk.bgMagenta.black('maze: transmitting public'));
      io.emit(`state${STATE.current}`);
      io.emit('mazeArrival', {maze: currentMaze.connectionsPublic});
    },
    onenterstate: (event, from, to) => {
      console.log(chalk.bgYellow.black(`event: ${event}, from: ${from}, to: ${to}`))
      io.emit(`state${to}`);
    }
  }
});

function initGameLoop () {
  STATE[STATE.transitions()[0]]();

  internalClock = setTimeout(() => {
    initGameLoop();
  }, 50000);
}

function init () {
  console.log('initiating game loop');
  initGameLoop();
}

function newConnectionInit (socket) {
  utils._addPlayer(socket.id);
    socket.emit('initConnection', {
        players: utils._getAllPlayers(),
        currentState: STATE.current
    });

  switch (STATE.current) {
    case STATES.INTERMISSION:
      socket.emit('mazeArrival', {maze: currentMaze.connectionsPublic});
      break;

    default:
      break;
  }

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

});
