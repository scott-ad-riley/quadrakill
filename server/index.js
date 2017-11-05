import socketIO from 'socket.io'
import Game from './game'
import { IN, OUT } from './events'
import GamesList from './games_list'

const games: GamesList = new GamesList()
declare type gameName = string

const io: SocketIO$Server = socketIO()
io.attach(8080)

io.on('connection', (socket: SocketIO$Socket): void => {
  socket.emit(OUT.GAMES_REFRESH, games.list())
  socket.on(IN.CREATE_GAME, function(gameName: gameName) {
    games.disconnectClientFromAllGames(socket.id)
    const game: Game = new Game(gameName, 512, 768, io)
    games.addGame(gameName, game)
    io.emit(OUT.GAMES_REFRESH, games.list())
  })

  socket.on(IN.JOIN_GAME, function(gameName: gameName) {
    games.disconnectClientFromAllGames(socket.id)
    games.connectClientToGame(gameName, socket)
  })

  socket.on(IN.QUIT_GAME, function(gameName: gameName) {
    games.disconnectClientFromGame(gameName, socket.id)
  })
  socket.on(IN.DISCONNECT, function() {
    games.disconnectClientFromAllGames(socket.id)
  })
})

console.log('Socket Server started at http://localhost:8080')
