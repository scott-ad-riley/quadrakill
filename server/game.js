import Engine from './engine'
import { ENGINE_OUT, ENGINE_IN, IN, OUT } from './events'
import type EventEmitter from 'events'

class Game {
  name: gameName
  players: { [string]: SocketIO$Socket }
  io: SocketIO$Server
  serverEngine: Engine
  maxPlayers: 4

  constructor(gameName: gameName, height: number, width: number, io: SocketIO$Server) {
    this.name = gameName
    this.players = {}
    this.io = io
    this.serverEngine = new Engine(width, height)
    this.setupListeners()
  }

  setupListeners(): void {
    let engine: string = this.serverEngine.eventEmitter
  }

  playerCount(): number {
    return Object.keys(this.players).length
  }

  disconnectClient(socketId: string): void {}
  connectClient(socket: SocketIO$Socket): void {
    //   this.serverEngine.eventEmitter.emit(ENGINE_IN.NEW_PLAYER, socket.id)
    //   this.setupEvents(socket)
    this.players[socket.id] = socket
  }
}

export default Game

// const Simulation = function({ name, height, width }: gameSetupData, io) {
//   this.name = name
//   this.players = {}
//   this.maxPlayers = 4
//   this.serverEngine = new Engine(width, height)
//   this.io = io
//
//   this.randomId = Math.round(Math.random() * 10000)
//   console.log('setup a simulation with id:', this.randomId)
//
//   this.setupListeners()
// }
//
// Simulation.prototype.playerCount = function() {
//   return Object.keys(this.players).length
// }
//
// Simulation.prototype.playerIDs = function() {
//   return Object.keys(this.players)
// }
//
// Simulation.prototype.setupListeners = function() {
//   // convert these to new server-engine setup
//   let engine = this.serverEngine.eventEmitter
//   engine.on(ENGINE_OUT.UPDATE_PLAYERS, this.updatePlayers.bind(this))
//   engine.on(ENGINE_OUT.UPDATE_PLAYER, this.updatePlayer.bind(this))
//   engine.on(ENGINE_OUT.CREATE_BULLET, this.createBullet.bind(this))
//   engine.on(ENGINE_OUT.REMOVE_WEAPON, this.removeWeapon.bind(this))
//   engine.on(ENGINE_OUT.REMOVE_ITEM, this.removeItem.bind(this))
//   engine.on(ENGINE_OUT.ON_PLAYER_TAKE_DAMAGE, this.playerTakeDamage.bind(this))
//   engine.on(ENGINE_OUT.ON_PLAYER_DEATH, this.playerDeath.bind(this))
// }
//
// // HANDLERS FOR THE SERVER ENGINE EMITTING EVENTS
//
// Simulation.prototype.updatePlayers = function(playersHash) {
//   this.io.sockets.in(this.name).emit(OUT.UPDATE_PLAYERS, playersHash)
// }
//
// Simulation.prototype.updatePlayer = function(player) {
//   this.players[player.id].to(this.name).broadcast.emit(OUT.UPDATE_PLAYER, player)
// }
//
// Simulation.prototype.createBullet = function(bulletData) {
//   this.players[bulletData.owner.id].to(this.name).broadcast.emit(OUT.CREATE_BULLET, bulletData)
// }
//
// Simulation.prototype.removeWeapon = function(weaponData) {
//   this.io.sockets.in(this.name).emit(OUT.REMOVE_WEAPON, weaponData)
// }
//
// Simulation.prototype.removeItem = function(itemData) {
//   this.io.sockets.in(this.name).emit(OUT.REMOVE_ITEM, itemData)
// }
//
// Simulation.prototype.playerTakeDamage = function(data) {
//   this.players[data.player.id].to(this.name).broadcast.emit(OUT.PLAYER_TAKE_DAMAGE, data)
// }
//
// Simulation.prototype.playerDeath = function(data) {
//   this.io.sockets.in(this.name).emit(OUT.REMOTE_PLAYER_DIED, data)
// }
//
// Simulation.prototype.setupEvents = function(socket) {
//   // this is to setup the server for any events the client might emit
//   socket.on(IN.PLAYER_MOVED, data => this.movePlayer(data))
//   socket.on(IN.BULLET_FIRED, data => this.bulletFired(data))
//   socket.on(IN.WEAPON_PICKED_UP, data => this.weaponPickedUp(data))
//   socket.on(IN.ITEM_PICKED_UP, data => this.itemPickedUp(data))
//   socket.on(IN.PLAYER_TAKE_DAMAGE, data => this.playerDamaged(data))
//   socket.on(IN.PLAYER_HAS_DIED, data => this.playerDied(data))
// }
//
// Simulation.prototype.movePlayer = function(data) {
//   this.serverEngine.eventEmitter.emit(ENGINE_IN.PLAYER_MOVED, data)
// }
// Simulation.prototype.bulletFired = function(data) {
//   this.serverEngine.eventEmitter.emit(ENGINE_IN.BULLET_FIRED, data)
// }
// Simulation.prototype.weaponPickedUp = function(data) {
//   this.serverEngine.eventEmitter.emit(ENGINE_IN.WEAPON_PICKED_UP, data)
// }
// Simulation.prototype.itemPickedUp = function(data) {
//   this.serverEngine.eventEmitter.emit(ENGINE_IN.ITEM_PICKED_UP, data)
// }
// Simulation.prototype.playerDamaged = function(data) {
//   this.serverEngine.eventEmitter.emit(ENGINE_IN.PLAYER_TAKE_DAMAGE, data)
// }
// Simulation.prototype.playerDied = function(data) {
//   this.serverEngine.eventEmitter.emit(ENGINE_IN.PLAYER_HAS_DIED, data)
// }
//
// // HANDLERS FOR THE SOCKET EMITTING EVENTS
//
// Simulation.prototype.connectPlayer = function(socket) {
//   this.serverEngine.eventEmitter.emit(ENGINE_IN.NEW_PLAYER, socket.id)
//   this.setupEvents(socket)
//   this.players[socket.id] = socket
// }
//
// Simulation.prototype.disconnectPlayer = function(socket, callback) {
//   if (this.players[socket.id]) {
//     this.serverEngine.eventEmitter.emit(ENGINE_OUT.REMOVE_PLAYER, socket.id)
//     delete this.players[socket.id]
//     this.clearEvents(socket)
//     callback()
//   }
// }
//
// Simulation.prototype.clearEvents = function(socket) {
//   // this is to remove the events created in setupEvents()
//   socket
//     .removeAllListeners([IN.PLAYER_MOVED])
//     .removeAllListeners([IN.BULLET_FIRED])
//     .removeAllListeners([IN.WEAPON_PICKED_UP])
//     .removeAllListeners([IN.ITEM_PICKED_UP])
//     .removeAllListeners([IN.PLAYER_TAKE_DAMAGE])
//     .removeAllListeners([IN.PLAYER_HAS_DIED])
// }
//
// export default Simulation
