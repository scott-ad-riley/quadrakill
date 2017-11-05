// NATIVE NODE PACKAGES
import EventEmitter from 'events'

//MAP DATA
import mapItemsData from './config/MapItemsData'

import { ENGINE_IN, ENGINE_OUT } from '../events'

//MODELS
var Player = require('./models/Player')
var Bullet = require('./models/Bullet')
var MapItems = require('./models/MapItems')
var Projectiles = require('./models/Projectiles')

//HELPERS/DEFAULTS
var MapObjectFactory = require('./utils/MapObjectFactory')
var MapItemFactory = require('./utils/MapItemFactory')
import spawnPoints from './utils/spawnPoints'

var Keys = require('./utils/keys')
var getDirection = require('./utils/getDirection')
var getNumbers = require('./utils/getNumbers')

var Engine = function(canvasWidth: number, canvasHeight: number) {
  this.players = {}
  this.bullets = []
  this.entities = this.setupEntities()
  this.bullets = new Projectiles()
  this.eventEmitter = new EventEmitter()
  this.canvas = {
    height: canvasHeight,
    width: canvasWidth,
  }
  this.setupEvents()
  // this.randomId = Math.round(Math.random() * 10000)
  // setInterval(() => {
  //   console.log(`game: ${this.randomId} has players: ${Object.keys(this.players)}`)
  // }, 1000)
  console.log('engine setup id:', this.randomId)
}

Engine.prototype.setupEvents = function() {
  this.eventEmitter.on(ENGINE_IN.NEW_PLAYER, data => this.addNewPlayer(data))
  this.eventEmitter.on(ENGINE_IN.REMOVE_PLAYER, data => this.removePlayer(data))
  this.eventEmitter.on(ENGINE_IN.PLAYER_MOVED, data => this.movePlayer(data))
  this.eventEmitter.on(ENGINE_IN.BULLET_FIRED, data => this.bulletFired(data))
  this.eventEmitter.on(ENGINE_IN.WEAPON_PICKED_UP, data => this.weaponPickedUp(data))
  this.eventEmitter.on(ENGINE_IN.ITEM_PICKED_UP, data => this.itemPickedUp(data))
  this.eventEmitter.on(ENGINE_IN.PLAYER_TAKE_DAMAGE, data => this.playerTakeDamage(data))
  this.eventEmitter.on(ENGINE_IN.PLAYER_HAS_DIED, data => this.playerDeath(data))
}

Engine.prototype.setupEntities = function() {
  return new MapItems(mapItemsData, {
    22: MapItemFactory.weapon['assault'],
    33: MapItemFactory.weapon['shotgun'],
    44: MapItemFactory.item['health'],
    55: MapItemFactory.item['overshield'],
    66: MapItemFactory.item['speedBoost'],
    77: MapItemFactory.item['cloak'],
  })
}

Engine.prototype.addNewPlayer = function(socketID) {
  let currentNumbers = getNumbers(this.players)
  let playerNumber
  for (let i = 1; i <= 4; i++) {
    if (currentNumbers.indexOf(i) === -1) {
      playerNumber = i
      break
    }
  }
  if (playerNumber) {
    let spawn = spawnPoints(playerNumber)
    this.players[socketID] = new Player(spawn.x, spawn.y, socketID, playerNumber)
    this.eventEmitter.emit(ENGINE_OUT.UPDATE_PLAYERS, this.players)
  }
  console.log('added a player so this.players keys:', Object.keys(this.players))
}

Engine.prototype.removePlayer = function(socketID) {
  console.log('removed a player with socket id:', socketID)
  delete this.players[socketID]
  this.eventEmitter.emit(ENGINE_OUT.UPDATE_PLAYERS, this.players)
}

Engine.prototype.movePlayer = function(player) {
  let playerToMove = this.players[player.id]
  playerToMove.x = player.x
  playerToMove.y = player.y
  playerToMove.hsp = player.hsp
  playerToMove.vsp = player.vsp
  this.eventEmitter.emit(ENGINE_OUT.UPDATE_PLAYER, playerToMove)
}

Engine.prototype.bulletFired = function(bullet) {
  let args = {
    player: {
      x: bullet.x,
      y: bullet.y,
    },
    speed: {
      hsp: bullet.hsp,
      vsp: bullet.vsp,
    },
  }
  let bulletOwner = this.players[bullet.owner.id]
  // this only gets fired if the client can actually fire a bullet
  if (bulletOwner.canFire()) {
    var newBullet = this.players[bullet.owner.id].fireBullet(getDirection(args.speed))
    this.bullets.items.push(newBullet)
    this.eventEmitter.emit(ENGINE_OUT.CREATE_BULLET, newBullet)
    this.eventEmitter.emit(ENGINE_OUT.UPDATE_PLAYERS, this.players)
    if (bulletOwner.bulletCount === 0) {
      bulletOwner.startReload()
      setTimeout(() => {
        bulletOwner.finishReload()
        this.eventEmitter.emit(ENGINE_OUT.UPDATE_PLAYERS, this.players)
      }, bulletOwner.reloadTime)
    }
  }
}

Engine.prototype.weaponPickedUp = function(data) {
  this.entities.weapons[data.weapon.id].active = false
  this.entities.weapons[data.weapon.id].restock()
  this.players[data.player.id].giveWeapon(data.weapon)
  this.eventEmitter.emit(ENGINE_OUT.REMOVE_WEAPON, data.weapon)
  this.eventEmitter.emit(ENGINE_OUT.UPDATE_PLAYERS, this.players)
}

Engine.prototype.itemPickedUp = function(data) {
  this.entities.items[data.item.id].active = false
  this.entities.items[data.item.id].restock(this.entities.items[data.item.id].respawnTime)
  this.players[data.player.id].giveItem(data.item)
  this.eventEmitter.emit(ENGINE_OUT.REMOVE_ITEM, data.item)
  this.eventEmitter.emit(ENGINE_OUT.UPDATE_PLAYERS, this.players)
}

Engine.prototype.playerTakeDamage = function(data) {
  this.players[data.player.id].takeDamage(data.value)
  this.eventEmitter.emit(ENGINE_OUT.ON_PLAYER_TAKE_DAMAGE, data)
  this.eventEmitter.emit(ENGINE_OUT.UPDATE_PLAYERS, this.players)
}

Engine.prototype.playerDeath = function(data) {
  const newPosition = spawnPoints(Math.ceil(Math.random() * 4))
  this.players[data.player.id].playerDeath(data.enemy, this.players)
  this.players[data.player.id].health = 4
  this.eventEmitter.emit(ENGINE_OUT.ON_PLAYER_DEATH, {
    player: data.player,
    enemy: data.enemy,
    newX: newPosition.x,
    newY: newPosition.y,
  })
  this.eventEmitter.emit(ENGINE_OUT.UPDATE_PLAYERS, this.players)
}

export default Engine
