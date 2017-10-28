import socketIO from 'socket.io'
import Simulation from './simulation'
import { IN, OUT } from './events'
import GamesList from './games_list'

const games: GamesList = new GamesList()
declare type gameName = string

const io: SocketIO$Server = socketIO()
io.attach(8080)

io.on('connection', (socket: SocketIO$Socket): void => {
  socket.emit(OUT.GAMES_REFRESH, games.list())
  socket.on(IN.CREATE_GAME, function(data: string) {
    disconnectSocket(socket)
    const simulation = new Simulation({ name: data, height: 512, width: 768 }, io)
    games[data] = simulation
    io.emit(OUT.GAMES_REFRESH, gameList())
  })

  socket.on(IN.JOIN_GAME, function(data) {
    disconnectSocket(socket)
    connectSocketToGame(games[data], socket)
  })

  socket.on(IN.QUIT_GAME, function(data) {
    disconnectSocket(socket)
  })
  socket.on(IN.DISCONNECT, function() {
    disconnectSocket(socket)
  })
})

function gameList(): { [gameName]: Simulation } {
  const result = {}
  forEachSimulation(game => {
    result[game.name] = {
      playersState: [game.playerCount(), game.maxPlayers],
    }
  })
  return result
}

const connectSocketToGame = function(simulation, socket) {
  socket.join(simulation.name)
  simulation.connectPlayer(socket)
}

function disconnectSocket(socket: SocketIO$Socket): void {
  games.forEach(game => {
    game.disconnectPlayer(socket)
  })
}

function disconnectSocketFromGame(game: Game): void {
  game.disonnectPlayer(socket)
}

console.log('Socket Server started at http://localhost:8080')
