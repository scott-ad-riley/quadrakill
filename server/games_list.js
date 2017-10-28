class GamesList {
  games: { [gameName]: Game }
  constructor() {
    this.games = {}
  }

  forEach(callback: Game => void): void {
    Object.keys(this.games).forEach((gameName: gameName): void => {
      callback(this.games[gameName])
    })
  }

  list(): { [gameName]: gameInfo } {
    return this.mapGames((game: Game): gameInfo => [game.playerCount(), game.maxPlayers])
  }

  mapGames<T>(callback: Game => T): { [gameName]: T } {
    const result: { [gameName]: T } = {}
    Object.keys(this.games).map((name: gameName) => {
      result[name] = callback(this.games[name])
    })
    return result
  }
}

export default GamesList
