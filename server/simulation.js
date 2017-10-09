// var Canvas = require('canvas');
var Engine = require('./engine');

var Simulation = function (data, io) {
  this.name = data.name;
  this.players = {};
  this.maxPlayers = data.maxPlayers || 4;
  // this.canvas = new Canvas(data.width, data.height)
  // this.ctx = this.canvas.getContext('2d');
  this.serverEngine = new Engine(data.width, data.height);
  this.io = io;

  // these are listeners to the server engine, to broadcast events over the socket
  this.setupListeners();
}

Simulation.prototype.playerCount = function () {
  return Object.keys(this.players).length;
}

Simulation.prototype.playerIDs = function () {
  return Object.keys(this.players)
}

Simulation.prototype.setupListeners = function () {
  // convert these to new server-engine setup
  let engine = this.serverEngine.eventEmitter;
  engine.on('update players', this.updatePlayers.bind(this));
  engine.on('update player', this.updatePlayer.bind(this));
  engine.on('create bullet', this.createBullet.bind(this));
  engine.on('remove weapon', this.removeWeapon.bind(this));
  engine.on('remove item', this.removeItem.bind(this));
  engine.on('on player take damage', this.playerTakeDamage.bind(this));
  engine.on('on player death', this.playerDeath.bind(this));
}

// HANDLERS FOR THE SERVER ENGINE EMITTING EVENTS

Simulation.prototype.updatePlayers = function (playersHash) {
  this.io.sockets.in(this.name).emit('update players', playersHash);
}

Simulation.prototype.updatePlayer = function (player) {
  this.players[player.id].to(this.name).broadcast.emit('update player', player);
}

Simulation.prototype.createBullet = function (bulletData) {
  this.players[bulletData.owner.id].to(this.name).broadcast.emit('create bullet', bulletData);
}

Simulation.prototype.removeWeapon = function (weaponData) {
  this.io.sockets.in(this.name).emit('remove weapon', weaponData);
}

Simulation.prototype.removeItem = function (itemData) {
  this.io.sockets.in(this.name).emit('remove item', itemData)
}

Simulation.prototype.playerTakeDamage = function (data) {
  this.players[data.player.id].to(this.name).broadcast.emit('player take damage', data)
}

Simulation.prototype.playerDeath = function (data) {
  this.io.sockets.in(this.name).emit('remote player died', data);
}

Simulation.prototype.setupEvents = function (socket) {
  // this is to setup the server for any events the client might emit
  socket.on('player moved', this.movePlayer.bind(this))
  socket.on('bullet fired', this.bulletFired.bind(this))
  socket.on('weapon picked up', this.weaponPickedUp.bind(this))
  socket.on('item picked up', this.itemPickedUp.bind(this))
  socket.on('player take damage', this.playerDamaged.bind(this))
  socket.on('player has died', this.playerDied.bind(this))
}

// HANDLERS FOR THE SOCKET EMITTING EVENTS

Simulation.prototype.connectPlayer = function (socket) {
  this.serverEngine.eventEmitter.emit('new player', socket.id);
  this.setupEvents(socket);
  this.players[socket.id] = socket;
}

Simulation.prototype.disconnectPlayer = function (socket, callback) {
  if (this.players[socket.id]) {
    this.serverEngine.eventEmitter.emit('remove player', socket.id);
    delete this.players[socket.id];
    this.clearEvents(socket);
    callback();
  }
}

Simulation.prototype.movePlayer = function (data) {
  this.serverEngine.eventEmitter.emit('player moved', data);
}

Simulation.prototype.bulletFired = function (data) {
  this.serverEngine.eventEmitter.emit('bullet fired', data);
}

Simulation.prototype.weaponPickedUp = function (data) {
  this.serverEngine.eventEmitter.emit('weapon picked up', data);
}

Simulation.prototype.itemPickedUp = function (data) {
  this.serverEngine.eventEmitter.emit('item picked up', data);
}

Simulation.prototype.playerDamaged = function (data) {
  this.serverEngine.eventEmitter.emit('player take damage', data);
}

Simulation.prototype.playerDied = function (data) {
  this.serverEngine.eventEmitter.emit('player has died', data);
}

Simulation.prototype.clearEvents = function (socket) {
  // this is to remove the events created in setupEvents()
  socket.removeListener('player moved', this.movePlayer)
  socket.removeListener('bullet fired', this.bulletFired)
  socket.removeListener('weapon picked up', this.weaponPickedUp)
  socket.removeListener('item picked up', this.itemPickedUp)
  socket.removeListener('player take damage', this.playerDamaged)
  socket.removeListener('player has died', this.playerDeath)
}



module.exports = Simulation;
