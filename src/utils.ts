import * as chalk from 'chalk';

import {IPlayersObj, IPlayer, IConfig} from './_interfaces';

class Utils {
  playersObj: IPlayersObj = {};
  playersArr: string[];
  config: IConfig;

  constructor (playersArrArg: string[], playersObjArg: IPlayersObj, configArg: IConfig) {
    this.config = configArg;
    this.playersArr = playersArrArg;
    this.playersObj = playersObjArg;
  }

  /**
  * Helper function to debug player messages
  */
  _ddp (message: string, playerId: string) {
    console.log(chalk.bgGreen(`player:${message} - ${playerId}`));
  }

  _findPlayer (playerId: string) {
    return this.playersObj[playerId] || {};
  }

  _getAllPlayers (): Object {
    return this.playersObj || {};
  }

  _playerScored (playerId: string, score: number): IPlayer | number {
    const player = this._findPlayer(playerId);
    if (player) {
      this.playersObj[playerId].currentScore += score;
      return this.playersObj[playerId];
    } else {
      return -1;
    }
  }

  _changePlayerAttr (playerId: string, attribute: string, value: any): IPlayer | number {
    const player = this._findPlayer(playerId);
    if (player) {
      this.playersObj[playerId][attribute] = value;

      return this.playersObj[playerId];
    } else {
      return -1;
    }
  }

  _removePlayer (playerId: string): boolean {
    const playerIdIndex: number = this.playersArr.indexOf(playerId);

    if (playerIdIndex > -1) {
      this.playersArr.splice(playerIdIndex, 1);

      if (this.playersObj[playerId]) {
        delete this.playersObj[playerId];
        this._ddp('disconnected', playerId);

        return true;
      } else {
        console.log(chalk.bgYellow.black(`failed to remove player 1`));
        return false;
      }
    } else {
      console.log(chalk.bgYellow.black(`failed to remove player 2`));
      return false;
    }
  }

  _addPlayer (playerId: string, username: string) {
    if (this.playersArr.indexOf(playerId) < 0) {
      this.playersArr.push(playerId);

      if (!this.playersObj[playerId]) {
        this.playersObj[playerId] = {
          currentScore: 0,
          id: playerId,
          username
        };

        this._ddp('connected', playerId);
        return true;
      } else {
        console.log(chalk.bgYellow.black(`failed to add player`));
        return false;
      }
    } else {
      console.log(chalk.bgYellow.black(`failed to add player`));
      return false;
    }
  }
}

export default Utils;
