import * as express from 'express';
import * as http from 'http';
import * as chalk from 'chalk';
import * as StateMachine from 'javascript-state-machine';
import * as sillyname from 'sillyname';
import * as SocketIOServer from 'socket.io';
import * as SourceMapSupport from 'source-map-support';

import config from './config';
import Utils from './utils';
import Grid from 'multiplayer-maze-core';
import PlayersManager from './PlayersManager';

SourceMapSupport.install();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const playersManager = new PlayersManager();
const utils = new Utils();

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
    { name: 'wait', from: STATES.PLAYING.name, to: STATES.WAITING.name },
    { name: 'play', from: STATES.WAITING.name, to: STATES.PLAYING.name }
  ],
  methods: {
    onWait: () => {
      currentMaze = generateMaze(pppp);
      io.emit('players-update', playersManager.getAllPlayers());
      setTimeout(() => {
        STATEMACHINE.play();
      }, STATES.WAITING.duration);
    },
    onPlay: () => {
      currentMaze = generateMaze(pppp);
      roundStartTime = Date.now();
      io.emit('maze-arrival', { maze: currentMaze });
      setTimeout(() => {
        STATEMACHINE.wait();
      }, STATES.PLAYING.duration);
    },
    // APPLIES TO ALL STATES
    onEnterState: lifecycle => {
      console.log(
        chalk.bgYellow.black(
          `FSM: transitioning states...  from: ${lifecycle.from}, to: ${
            lifecycle.to
          }, ${Object.keys(lifecycle)}`
        )
      );
      io.emit(`fsm-${lifecycle.to}`);
    }
  }
});

function initGameLoop () {
  console.log(STATEMACHINE.transitions());
  currentMaze = generateMaze(pppp);
  STATEMACHINE.play();
}

function init () {
  console.log('initiating game loop');
  initGameLoop();
}

server.listen(config.port, () => {
  console.log(chalk.bgRed.black(`listing on port: ${config.port}`));
  init();
});

io.on('connection', socket => {
  const playerUsername = sillyname();
  playersManager.addPlayer(socket.id);

  socket.emit('socket-initConnection', {
    players: playersManager.getAllPlayers(),
    currentState: STATEMACHINE.state,
    maze: currentMaze,
    username: playerUsername
  });

  socket.on('disconnect', () => {
    playersManager.removePlayer(socket.id);
  });

  socket.on('player:scored', data => {
    utils.ddp('scored', socket.id);
    const score = utils.calculateScore(roundStartTime);
    playersManager.playerScored(socket.id, score);
    utils.printLeaderBoard(playersManager.getAllPlayers());
  });

  socket.on('player:changedName', data => {
    playersManager.changeUsername(socket.id, data.newName);
  });
});
