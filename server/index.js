var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Simulation = require('./simulation.js');
var games = {};
server.listen(8080);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/error_page.html');
});

io.on('connection', function (socket) {
  socket.emit('games refresh', gameList());
  socket.on('create game', function (data) {
    disconnectSocketFromGames(socket);
    var simulation = new Simulation({name: data, height: 512, width: 768}, io);
    games[data] = simulation;
    io.emit('games refresh', gameList());
  });

  socket.on('join game', function (data) {
    disconnectSocketFromGames(socket);
    connectSocketToGame(games[data], socket);
  })

  socket.on('quit game', function (data) {
    disconnectSocketFromGames(socket);
  });
  socket.on('disconnect', function () {
    disconnectSocketFromGames(socket);
  });

});

var forEachSimulation = function (callback) {
  for(var simulationKey in games) {
    if(games.hasOwnProperty(simulationKey)) {
        callback(games[simulationKey]);
    }
  }
}

var gameList = function () {
  var result = {}
  forEachSimulation((game) => {
    result[game.name] = {
      playersState: [game.playerCount(), game.maxPlayers]
    }
  })
  return result;
}

var connectSocketToGame = function (simulation, socket) {
  socket.join(simulation.name)
  simulation.connectPlayer(socket);
}

var disconnectSocketFromGames = function (socket) {
  forEachSimulation((simulation) => {
    simulation.disconnectPlayer(socket, () => {
      socket.leave(simulation.name)
      console.log(socket.id, 'left room:', simulation.name)
    });
  })
}

console.log('Socket Server started at http://localhost:8080');