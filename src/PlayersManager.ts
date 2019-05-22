import sillyname from 'sillyname';
import { IPlayer, IPlayers, IPLayersManager, IPlayersSerialized } from './_interfaces';
import Player from './Player';

class PLayersManager implements IPLayersManager {
  players: IPlayers = {};
  usernames: string[] = [];
  scoreboard: string[] = [];

  private findPlayer(playerId: string): IPlayer {
    return this.players[playerId];
  }

  getPlayerKeys(): string[] {
    return Object.keys(this.players);
  }

  getPlayer(playerId: string): IPlayer {
    return this.findPlayer(playerId);
  }

  getAllPlayers(): IPlayersSerialized {
    return {
      byId: this.players,
      ids: Object.keys(this.players)
    };
  }

  addPlayer(newPlayerId: string, newPlayerUsername?: string): string {
    const username = newPlayerUsername || sillyname();
    this.players[newPlayerId] = new Player(newPlayerId, username);
    this.usernames.push(newPlayerUsername);

    return username;
  }

  removePlayer(playerId: string): boolean {
    const player = this.findPlayer(playerId);
    if (player) {
      const index = this.usernames.indexOf(player.username);
      this.usernames.slice(index, 1);
      delete this.players[playerId];
      return true;
    } else {
      return false;
    }
  }

  playerScored(playerId: string, score: number): number {
    const player = this.findPlayer(playerId);
    if (player) {
      return player.updateScore(score);
    } else {
      return 0;
    }
  }

  usernameExists(username: string): boolean {
    return this.usernames.indexOf(username) > -1;
  }

  changeUsername(playerId: string, newUsername: string): boolean {
    const player = this.findPlayer(playerId);
    if (player && !this.usernameExists(newUsername)) {
      player.changeUsername(newUsername);
      return true;
    } else {
      return false;
    }
  }

  setScoreboard(): void {
    this.scoreboard = Object.values(this.players)
      .sort((a, b) => a.currentScore < b.currentScore ? 1 : -1)
      .map(curr => curr.id)
  }

  // TODO fix top
  getScoreboard(top: number = 1000, playerId?: string): IPlayersSerialized {
    let topPlayers = this.scoreboard
      .slice(0, top)
      .reduce((acc, curr, index) => {
        acc.ids.push(curr);
        acc.byId[curr] = { ...this.players[curr], place: index };

        return acc;
      }, { ids: [], byId: {} })

    if (playerId) {
      const playerToAdd = this.getPlayer(playerId);
      if (playerToAdd && !topPlayers.byId[playerId]) {
        topPlayers.ids.push(playerId);
        topPlayers.byId[playerId] = playerToAdd;
      }
    }

    return topPlayers;
  }
}

export default PLayersManager;
