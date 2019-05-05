export interface IPlayer {
  currentScore: number;
  id: string;
  username: string;
  changeUsername(newUsername: string): void;
  updateScore(score: number): number;
}

export interface IPlayers {
  [s: string]: IPlayer;
}

export interface IPlayersSerialized {
  byId: IPlayers,
  ids: string[]
}

export interface IUtils {
  ddp(message: string, playerId: string): void;
  printLeaderBoard(players: IPlayers): void;
  calculateScore(roundStartTime: number): number;
}

export interface IPLayersManager {
  players: { [s: string]: IPlayer };
  usernames: string[];
  addPlayer(newPlayerId: string): string;
  removePlayer(playerId: string): boolean;
  playerScored(playerId: string, score: number): number;
  changeUsername(playerId: string, newUsername: string): boolean;
}

export interface IConfig {
  scoreIncrementer: number;
  port: number;
  durationRound: number;
  durationIntermission: number;
}

export interface IAlgos {
  [k: string]: (grid: IGrid) => GridConnections;
}

export type CellDictionary = { [k: string]: ICell };

export interface IGrid {
  grid: ICell[][];
  grid2: CellDictionary;
  rows: number;
  columns: number;
  makeMatrixFromDict(): ICell[][];
  print(): string;
  eachCell(): ICell[];
}

export interface IGridConfig {
  algo?: string;
  rows: number;
  columns: number;
  cellSize?: number;
}

export interface ICellNeighbors {
  north: ICell;
  south: ICell;
  east: ICell;
  west: ICell;
}

export type Direction = 'north' | 'south' | 'east' | 'west';
export type GridConnections = number[][];

export interface ICell {
  neighbors: { [K in Direction]?: ICell | string };
  links: { [K: string]: ICell };
  neighborsId?: number;
  column: number;
  row: number;
  id: string;
  distance: number;
  // setDistance(distance: number);
  setLink(link: ICell, bidirectional?: boolean): void;
  getLink(id: string): ICell;
  // delLink(cell: ICell, bidirectional: boolean);
  getLinksIds(): string[];
  isLinked(cell: ICell | string): ICell | boolean;
  setNeighbors(direction: Direction, neighbors: ICell): void;
  getNeighbors(direction: Direction): ICell;
}
