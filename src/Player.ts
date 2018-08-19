import { IPlayer } from './_interfaces';

class Player implements IPlayer {
  id: string;
  username: string;
  currentScore: number = 0;

  constructor (id: string, username: string) {
    this.id = id;
    this.username = username;
    this.currentScore = 0;
  }

  changeUsername (newUsername: string): void {
    this.username = newUsername;
  }

  updateScore (newScore: number): void {
    this.currentScore += newScore;
  }
}

export default Player;
