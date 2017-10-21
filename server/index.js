var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
import Simulation from './simulation'
import { IN, OUT } from './events'
const games = {}
server.listen(8080)

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/error_page.html')
})

io.on('connection', function(socket) {
  socket.emit(OUT.GAMES_REFRESH, gameList())
  socket.on(IN.CREATE_GAME, function(data) {
    disconnectSocketFromGames(socket)
    const simulation = new Simulation({ name: data, height: 512, width: 768 }, io)
    games[data] = simulation
    io.emit(OUT.GAMES_REFRESH, gameList())
  })

  socket.on(IN.JOIN_GAME, function(data) {
    disconnectSocketFromGames(socket)
    connectSocketToGame(games[data], socket)
  })

  socket.on(IN.QUIT_GAME, function(data) {
    disconnectSocketFromGames(socket)
  })
  socket.on(IN.DISCONNECT, function() {
    disconnectSocketFromGames(socket)
  })
})

const forEachSimulation = function(callback) {
  for (let simulationKey in games) {
    if (games.hasOwnProperty(simulationKey)) {
      callback(games[simulationKey])
    }
  }
}

const gameList = function() {
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

const disconnectSocketFromGames = function(socket) {
  forEachSimulation(simulation => {
    simulation.disconnectPlayer(socket, () => {
      socket.leave(simulation.name)
      console.log(socket.id, 'left room:', simulation.name)
    })
  })
}

console.log('Socket Server started at http://localhost:8080')
