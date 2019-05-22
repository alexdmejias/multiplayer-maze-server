import express from "express";
import * as http from 'http';
import chalk from 'chalk';
import * as SocketIO from 'socket.io';
import * as SourceMapSupport from 'source-map-support';

import config from './config';
import Utils from './utils';
// import Grid from 'multiplayer-maze-core';
import Grid from './mazes/grid';
import PlayersManager from './PlayersManager';
import StateMachine, { ITransitions } from "./StateMachine";
import logger from './logger';
import { IAlgos, GridConnections, gridPayload, IPlayer } from "./_interfaces";
import Algos from './mazes/algos';
import { parsedIdFromStr } from "./mazes/utils";
SourceMapSupport.install();

const app = express();
const server = http.createServer(app);

// configure socket.io
const io = SocketIO.default(server);
const playersManager = new PlayersManager();

const utils = new Utils();
let roundStartTime = 0;
let currentMaze: gridPayload;

const gridConfig = {
  algo: 'aldousBroder',
  rows: 10,
  columns: 10
};

function generateMaze(props: { algo: string, rows: number, columns: number }): gridPayload {
  logger.debug('app.generating maze');
  const maze = new Grid(props);
  const cons = maze.transformGrid(Algos[props.algo])
  const endPosts = maze.getDistances();

  return {
    maze: cons,
    rows: props.rows,
    columns: props.columns,
    starting: parsedIdFromStr(endPosts[0]),
    ending: parsedIdFromStr(endPosts[1])
  }
}

const transitions: ITransitions = {
  'waiting': {
    duration: (1000 * 10),
    to: 'playing',
    from: 'waiting'
  },
  'playing': {
    duration: (1000 * 13),
    to: 'waiting',
    from: 'playing',
    // name: 'playing'
  },
}

const STATEMACHINE = new StateMachine({
  initTransition: 'waiting',
  methods: {
    onWaiting: () => {
      const d = new Date();
      console.log('alexalex - ----------', 'onWaiting', d.getUTCSeconds());
      currentMaze = generateMaze(gridConfig);
    },
    onPlaying: () => {
      const d = new Date();
      console.log('alexalex - ++++++++++', 'onPlaying', d.getUTCSeconds());
      roundStartTime = Date.now();
    },
    onEnterState: (from: string, to: string) => {
      playersManager.setScoreboard();
      io.emit('state-change', {
        opponents: playersManager.getScoreboard(),
        currentState: to,
        duration: transitions[to].duration,
        grid: currentMaze,
      })
    }
  },
  transitions
});

server.listen(config.port, () => {
  console.log(chalk.bgRed.black(`listing on port: ${config.port}`));
  logger.debug('app.initiating game loop');
  STATEMACHINE.init();
});

io.on('connection', async socket => {
  const newPlayer = playersManager.addPlayer(socket.id, socket.handshake.query.name);

  console.log(
    chalk.bgRed.black(`new player joined: ${socket.id} AKA ${newPlayer}`)
  );

  const player = playersManager.getPlayer(socket.id);

  if (!player) {
    // console.log('alexalex - ##########', 'no player found');
    // console.log(socket.id)
    // console.log(playersManager.getAllPlayers())
  }

  socket.emit('init-connection', {
    opponents: playersManager.getScoreboard(),
    currentState: STATEMACHINE.currentTransition,
    grid: currentMaze,
    player: player || { nope: 'nope' }
  });

  socket.on('disconnect', () => {
    playersManager.removePlayer(socket.id);
  });

  socket.on('player:scored', (data: any) => {
    utils.ddp('scored', socket.id);
    const score = utils.calculateScore(roundStartTime);
    const newScore = playersManager.playerScored(socket.id, score);
    // const allPlayers = playersManager.getAllPlayers();
    // utils.printLeaderBoard(allPlayers);
    // const player = playersManager.getPlayer()
    socket.emit('player-scored', { player: playersManager.getPlayer(socket.id) });
  });

  socket.on('player:change-name', (data: any) => {
    if (playersManager.changeUsername(socket.id, data.newName)) {
      socket.emit('player:change-name', {
        status: 'fail',
        message: 'username already taken'
      });
    } else {
      socket.emit('player-change-name', {
        status: 'success',
        message: 'successfully changed username'
      });
    }
  });

  socket.on('debug:time-stop', (date: any) => {
    console.log('alexalex - ++++++++++', 'STOPPING');
    STATEMACHINE.stop();
  });

  socket.on('debug:time-play', (date: any) => {
    console.log('alexalex - ++++++++++', 'PLAYING');
    STATEMACHINE.play();
  });
});
