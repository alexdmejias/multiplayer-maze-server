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
let currentMaze: gridPayload;

interface gridPayload {
  maze: number[][],
  rows: number,
  columns: number,
  starting: [number, number],
  ending: [number, number]
}

function generateMaze(props): gridPayload {
  logger.debug('app.generating maze');
  const maze = new Grid(props);
  const mazeConnections = maze.getAllCellConnections();
  console.log(maze.print());
  // const mazeConnectionsSplitIndex: number = -1 * (props.size + 1);

  return {
    maze: mazeConnections,
    rows: props.rows,
    columns: props.columns,
    starting: [9, 0],
    ending: [0, 9]
  }
}

const transitions: ITransitions = {
  'playing': {
    duration: 600000,
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
      console.log('alexalex - >>>>>>>>>>', STATEMACHINE.currentTransition);
      io.emit('state-change', {
        opponents: playersManager.getAllPlayers(),
        currentState: STATEMACHINE.currentTransition,
        grid: currentMaze,
      })
    }
  },
  transitions
});

// function getStateChangePayload(nextStage) {
//   const payload: { gameState: string; maze?: string } = {
//     // TODO: ewww
//     gameState: nextStage
//   };

//   if (nextStage === 'playing') {
//     payload.maze = currentMaze;
//   }

//   return payload;
// }

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
    opponents: playersManager.getAllPlayers(),
    currentState: 'playing',
    grid: currentMaze,
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
    // utils.printLeaderBoard(allPlayers);
    io.emit('players-update', allPlayers);
  });

  socket.on('player:changedName', data => {
    playersManager.changeUsername(socket.id, data.newName);
  });
});
