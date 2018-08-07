export interface IPlayer {
  currentScore: number;
  id: string;
  username?: string;
};

export interface IPlayersObj {
  [s:string]: IPlayer;
}

export interface IConfig {
  scoreIncrementer: number;
  port: number;
  durationRound: number;
  durationIntermission: number;
}

export interface IGrid {
  grid: ICell[][];
  rows: number;
  columns;
  print (): string;
}

export interface ICellNeighbors {
  north: ICell,
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
  setDistance( distance: number);
  links: any;
  position?: {top: number, left: number};
  setLink (link: ICell);
  getLink (id: string): ICell;
  delLink (cell: ICell, bidirectional: boolean);
  getLinksIds (): string[];
  isLinked (cell: ICell);
  setNeighbors (direction: string, neighbors: ICell);
  getNeighbors (direction: string): ICell;
}
