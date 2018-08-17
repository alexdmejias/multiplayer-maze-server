import * as express from 'express';
import * as http from 'http';
import * as chalk from 'chalk';
import * as StateMachine from 'javascript-state-machine';
import { table } from 'table';

import config from './config';
import Utils from './utils';
import {IPlayersObj, IConfig} from './_interfaces';
import Grid from 'multiplayer-maze-core';

import * as sillyname from 'sillyname';

require('source-map-support').install();

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const playersArr: string[] = [];
const playersObj: IPlayersObj = {};
const utils = new Utils(playersArr, playersObj, config);

const pppp = {
  algo: 'Binary',
  size: 10
};

let roundStartTime = 0;
let currentMaze;

function generateMaze (props) {
  console.log(chalk.bgMagenta.black('maze: generating'));
  const maze = new Grid(props.size, props.size, props.algo);
  const mazeConnections = maze.allCellConnectionsAsStr();
  // const mazeConnectionsSplitIndex: number = -1 * (props.size + 1);

  return mazeConnections;
}

const STATES = {
  WAITING: {
    name: 'waiting',
    duration: 5000
  },
  PLAYING: {
    name: 'playing',
    duration: 10000
  }
};

const STATEMACHINE = new StateMachine({
  init: STATES.WAITING.name,
  transitions: [
    {name: 'wait', from: STATES.PLAYING.name, to: STATES.WAITING.name},
    {name: 'play', from: STATES.WAITING.name, to: STATES.PLAYING.name}
  ],
  methods: {
    'onWait': () => {
      currentMaze = generateMaze(pppp);
      io.emit('players-update', utils._getAllPlayers());
      setTimeout(() => {
        STATEMACHINE.play();
      }, STATES.WAITING.duration);
    },
    'onPlay': () => {
      currentMaze = generateMaze(pppp);
      roundStartTime = Date.now();
      io.emit('maze-arrival', {maze: currentMaze});
      setTimeout(() => {
        STATEMACHINE.wait();
      }, STATES.PLAYING.duration);
    },
    // APPLIES TO ALL STATES
    'onEnterState': (lifecycle) => {
      console.log(chalk.bgYellow.black(`FSM: transitioning states...  from: ${lifecycle.from}, to: ${lifecycle.to}, ${Object.keys(lifecycle)}`));
      io.emit(`fsm-${lifecycle.to}`);
    }
  }
});

function printLeaderBoard () {
  const players = utils._getAllPlayers();
  const data = [['player id', 'usrname', 'score']];

  Object.keys(players).forEach((curr) => {
    data.push([curr, players[curr].username || 'N/A', players[curr].currentScore]);
  });

  console.log(table(data));
}

function initGameLoop () {
  console.log(STATEMACHINE.transitions());
  currentMaze = generateMaze(pppp);
  STATEMACHINE.play();
}

function init () {
  console.log('initiating game loop');
  initGameLoop();
}

server.listen(config.port, function () {
  console.log(chalk.bgRed.black(`listing on port: ${config.port}`));
  init();
});

io.on('connection', function (socket) {
  const playerUsername = sillyname();
  utils._addPlayer(socket.id, playerUsername);

  socket.emit('socket-initConnection', {
    players: utils._getAllPlayers(),
    currentState: STATEMACHINE.state,
    maze: currentMaze,
    username: playerUsername
  });

  socket.on('disconnect', () => {
    utils._removePlayer(socket.id);
  });

  socket.on('player:scored', (data) => {
    utils._ddp('scored', socket.id);
    const now = Date.now();
    const score = Math.floor((5000 - (roundStartTime - now)) / 1000);
    utils._playerScored(socket.id, score);
    printLeaderBoard();
  });

  socket.on('player:changedName', (data) => {
    utils._changePlayerAttr(socket.id, 'username', data.newName);
  });

  socket.on('systemStatus', () => {
    playersArr.forEach((player) => {
      console.log(`${player} - ${playersObj[player].currentScore}`);
    });
  });
});
