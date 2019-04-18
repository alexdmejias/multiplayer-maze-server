import sillyname from 'sillyname';
import { IPlayer, IPlayers, IPLayersManager, IPlayersSerialized } from './_interfaces';
import Player from './Player';

class PLayersManager implements IPLayersManager {
  players: IPlayers = {};

  private findPlayer(playerId: string): IPlayer | null {
    return this.players[playerId];
  }

  getPlayerKeys(): string[] {
    return Object.keys(this.players);
  }

  getAllPlayers(): IPlayersSerialized {
    return {
      byId: this.players,
      ids: Object.keys(this.players)
    };
  }

  addPlayer(newPlayerId): string {
    const playerUsername = sillyname();
    this.players[newPlayerId] = new Player(newPlayerId, playerUsername);

    return playerUsername;
  }

  removePlayer(playerId: string): boolean {
    const player = this.findPlayer(playerId);
    if (player) {
      delete this.players[playerId];
      return true;
    } else {
      return false;
    }
  }

  playerScored(playerId: string, score: number): boolean {
    const player = this.findPlayer(playerId);
    if (player) {
      player.updateScore(score);
      return true;
    } else {
      return false;
    }
  }

  changeUsername(playerId: string, newUsername): boolean {
    const player = this.findPlayer(playerId);
    if (player) {
      player.changeUsername(newUsername);
      return true;
    } else {
      return false;
    }
  }
}

export default PLayersManager;
