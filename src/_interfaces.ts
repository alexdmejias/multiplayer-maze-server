export interface IPlayer {
  currentScore: number;
};

export interface IPlayersObj {
  [s:string]: IPlayer;
}

export interface IConfig {
  scoreIncrementer: number;
  roundDuration: number;
  port: number;
}