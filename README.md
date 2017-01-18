# multiplayer-maze-server

sequence of events
  connected
    intermission
      - sends new maze to players
    starting
      - signals that the game is about to start
    started
      - starts the game, the maze is displayed to the players
    finishing
      - game is about to end
    finished
      - the game has ended
    updating
      - scores are computed and sent over to players
