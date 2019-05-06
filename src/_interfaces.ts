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
  linkCells(baseCell: CellId, direction: Direction): void;
}

export interface IGridConfig {
  algo?: string;
  rows: number;
  columns: number;
  cellSize?: number;
}

export interface ICellNeighbors {
  north: string;
  south: string;
  east: string;
  west: string;
}

export type Direction = 'north' | 'south' | 'east' | 'west';
export type CellId = string;
export type GridConnections = number[][];

export interface ICell {
  neighbors: { [K in Direction]?: string };
  links: { [K in Direction]?: string };
  neighborsId?: number;
  column: number;
  row: number;
  id: CellId;
  distance: number;
  // setDistance(distance: number);
  // getOppositeDirection(direction: Direction): Direction;
  setLink(link: CellId, direction: Direction, bidirectional?: boolean): void;
  getLink(direction: Direction): CellId;
  // delLink(cell: ICell, bidirectional: boolean);
  getLinksIds(): CellId[];
  // isLinked(cellId: CellId): boolean;
  hasLink(direction: Direction): boolean;
  setNeighbors(direction: Direction, neighbors: ICell): void;
  getNeighbors(direction: Direction): ICell;
}
