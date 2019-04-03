import express from "express";
import * as http from 'http';
import chalk from 'chalk';
// import * as StateMachine from 'javascript-state-machine';
import * as SocketIO from 'socket.io';
import * as SourceMapSupport from 'source-map-support';

import config from './config';
import Utils from './utils';
// import Grid from 'multiplayer-maze-core';
import Grid from './mazes/grid';
import PlayersManager from './PlayersManager';
import StateMachine, { ITransitions } from "./StateMachine";
import logger from './logger';
import { Socket } from "net";

SourceMapSupport.install();

const app = express();
const server = http.createServer(app);
const io = SocketIO.default(server);

const playersManager = new PlayersManager();
const utils = new Utils();

const gridConfig = {
  algo: 'binary',
  rows: 10,
  columns: 10
};

let roundStartTime = 0;
let currentMaze;

function generateMaze(props) {
  logger.debug('app.generating maze');
  const maze = new Grid(props);
  const mazeConnections = maze.allCellConnectionsAsStr();
  console.log(maze.print());
  // const mazeConnectionsSplitIndex: number = -1 * (props.size + 1);

  return mazeConnections;
}

const transitions: ITransitions = {
  'playing': {
    duration: 5000,
    to: 'waiting',
    from: 'playing',
    // name: 'playing'
  },
  'waiting': {
    duration: 5000,
    to: 'playing',
    from: 'waiting'
  }
}

const STATEMACHINE = new StateMachine({
  initTransition: 'waiting',
  methods: {
    onWaiting: () => {
      currentMaze = generateMaze(gridConfig);
    },
    onPlaying: () => {
      roundStartTime = Date.now();
    },
    onEnterState: (from, to) => {
      io.emit('state-change', {
        players: playersManager.getAllPlayers(),
        currentState: STATEMACHINE.currentTransition,
        maze: currentMaze,
      })
    }
  },
  transitions
});

// const wasd = new StateMachine.StateMachine({
// const STATEMACHINE = new StateMachine.create({
//   init: STATES.WAITING.name,
//   transitions: [
//     { name: 'wait', from: STATES.PLAYING.name, to: STATES.WAITING.name },
//     { name: 'play', from: STATES.WAITING.name, to: STATES.PLAYING.name }
//   ],
//   methods: {
//     onWait: () => {
//       currentMaze = generateMaze(pppp);

//       io.emit('players-update', playersManager.getAllPlayers());
//       setTimeout(() => {
//         STATEMACHINE.play();
//       }, STATES.WAITING.duration);
//     },
//     onPlay: () => {
//       currentMaze = generateMaze(pppp);
//       roundStartTime = Date.now();
//       setTimeout(() => {
//         STATEMACHINE.wait();
//       }, STATES.PLAYING.duration);
//     },
//     // APPLIES TO ALL STATES
//     onEnterState: (lifecycle: { from?: any; to?: any; }) => {
//       console.log(
//         chalk.bgYellow.black(
//           `FSM: transitioning states...  from: ${lifecycle.from}, to: ${
//           lifecycle.to
//           }, ${Object.keys(lifecycle)}`
//         )
//       );

//       io.emit(`fsm-state-change`, getStateChangePayload(lifecycle.to));
//     }
//   }
// });

function getStateChangePayload(nextStage) {
  const payload: { gameState: string; maze?: string } = {
    // TODO: ewww
    gameState: nextStage
  };

  if (nextStage === 'playing') {
    payload.maze = currentMaze;
  }

  return payload;
}

function init() {
  logger.debug('app.initiating game loop');
  currentMaze = generateMaze(gridConfig);
  STATEMACHINE.init();
}

server.listen(config.port, () => {
  console.log(chalk.bgRed.black(`listing on port: ${config.port}`));
  init();
});

io.on('connection', socket => {
  const newPlayer = playersManager.addPlayer(socket.id);
  console.log(
    chalk.bgRed.black(`new player joined: ${socket.id} AKA ${newPlayer}`)
  );

  socket.emit('init-connection', {
    players: playersManager.getAllPlayers(),
    currentState: STATEMACHINE.currentTransition,
    maze: currentMaze,
    username: newPlayer,
    id: socket.id
  });

  socket.on('disconnect', () => {
    playersManager.removePlayer(socket.id);
  });

  socket.on('player:scored', data => {
    utils.ddp('scored', socket.id);
    const score = utils.calculateScore(roundStartTime);
    playersManager.playerScored(socket.id, score);
    const allPlayers = playersManager.getAllPlayers();
    utils.printLeaderBoard(allPlayers);
    io.emit('players-update', allPlayers);
  });

  socket.on('player:changedName', data => {
    playersManager.changeUsername(socket.id, data.newName);
  });
});
