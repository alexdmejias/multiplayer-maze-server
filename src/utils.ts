import * as chalk from 'chalk';
import { table } from 'table';

import { IPlayers, IUtils } from './_interfaces';

class Utils implements IUtils {
  constructor () {}

  /**
   * Helper function to debug player messages
   */
  ddp (message: string, playerId: string) {
    console.log(chalk.bgGreen(`player:${message} - ${playerId}`));
  }

  printLeaderBoard (players: IPlayers): void {
    const data: (string | number)[][] = [['player id', 'usrname', 'score']];

    Object.keys(players).forEach(curr => {
      data.push([curr, players[curr].username, players[curr].currentScore]);
    });

    console.log(table(data));
  }

  calculateScore (roundStartTime: number): number {
    const now = Date.now();
    const score = Math.floor((5000 - (roundStartTime - now)) / 1000);

    return score;
  }
}

export default Utils;
