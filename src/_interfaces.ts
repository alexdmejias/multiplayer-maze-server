export interface IPlayer {
  currentScore: number;
  id: string;
  username: string;
  changeUsername(newUsername: string): void;
  updateScore(score: number): void;
}

export interface IPlayers {
  [s: string]: IPlayer;
}

export interface IUtils {
  ddp(message: string, playerId: string): void;
  printLeaderBoard(players: IPlayers): void;
  calculateScore(roundStartTime: number): number;
}

export interface IPLayersManager {
  players: { [s: string]: IPlayer };
  addPlayer(player: IPlayer): void;
  removePlayer(playerId: string): boolean;
  playerScored(playerId: string, score: number);
  changeUsername(playerId: string, newUsername: string): boolean;
}

export interface IConfig {
  scoreIncrementer: number;
  port: number;
  durationRound: number;
  durationIntermission: number;
}

export interface IAlgos {
  binary: Function;
}

export interface IGrid {
  grid: ICell[][];
  rows: number;
  columns;
  print(): string;
}

export interface IGridConfig {
  algo?: string;
  rows: number;
  columns: number;
}

export interface ICellNeighbors {
  north: ICell;
  south: ICell;
  east: ICell;
  west: ICell;
}

export interface ICell {
  neighbors: any;
  neighborsId?: number;
  column: number;
  row: number;
  id: string;
  distance: number;
  setDistance(distance: number);
  links: any;
  position?: { top: number; left: number };
  setLink(link: ICell);
  getLink(id: string): ICell;
  delLink(cell: ICell, bidirectional: boolean);
  getLinksIds(): string[];
  isLinked(cell: ICell);
  setNeighbors(direction: string, neighbors: ICell);
  getNeighbors(direction: string): ICell;
}
