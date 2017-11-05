import type Game from './game'

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

  addGame(gameName: gameName, game: Game): void {
    this.games[gameName] = game
  }

  disconnectClientFromAllGames(socketId: string) {
    this.forEach(game => game.disconnectClient(socketId))
  }

  disconnectClientFromGame(gameName: string, socketId: string): void {
    this.games[gameName].disconnectClient(socketId)
  }

  connectClientToGame(gameName: string, socket: SocketIO$Socket): void {
    this.games[gameName].connectClient(socket)
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
