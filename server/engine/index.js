// NATIVE NODE PACKAGES
var EventEmitter = require('events')

//MAP DATA
import mapItemsData from '../../data/items.json'

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

var Engine = function(canvasWidth, canvasHeight) {
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
  this.eventEmitter.on('new player', data => this.addNewPlayer(data))
  this.eventEmitter.on('remove player', data => this.removePlayer(data))
  this.eventEmitter.on('player moved', data => this.movePlayer(data))
  this.eventEmitter.on('bullet fired', data => this.bulletFired(data))
  this.eventEmitter.on('weapon picked up', data => this.weaponPickedUp(data))
  this.eventEmitter.on('item picked up', data => this.itemPickedUp(data))
  this.eventEmitter.on('player take damage', data => this.playerTakeDamage(data))
  this.eventEmitter.on('player has died', data => this.playerDeath(data))
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
    this.eventEmitter.emit('update players', this.players)
  }
  console.log('added a player so this.players keys:', Object.keys(this.players))
}

Engine.prototype.removePlayer = function(socketID) {
  console.log('removed a player with socket id:', socketID)
  delete this.players[socketID]
  this.eventEmitter.emit('update players', this.players)
}

Engine.prototype.movePlayer = function(player) {
  let playerToMove = this.players[player.id]
  playerToMove.x = player.x
  playerToMove.y = player.y
  playerToMove.hsp = player.hsp
  playerToMove.vsp = player.vsp
  this.eventEmitter.emit('update player', playerToMove)
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
    this.eventEmitter.emit('create bullet', newBullet)
    this.eventEmitter.emit('update players', this.players)
    if (bulletOwner.bulletCount === 0) {
      bulletOwner.startReload()
      setTimeout(() => {
        bulletOwner.finishReload()
        this.eventEmitter.emit('update players', this.players)
      }, bulletOwner.reloadTime)
    }
  }
}

Engine.prototype.weaponPickedUp = function(data) {
  this.entities.weapons[data.weapon.id].active = false
  this.entities.weapons[data.weapon.id].restock()
  this.players[data.player.id].giveWeapon(data.weapon)
  this.eventEmitter.emit('remove weapon', data.weapon)
  this.eventEmitter.emit('update players', this.players)
}

Engine.prototype.itemPickedUp = function(data) {
  this.entities.items[data.item.id].active = false
  this.entities.items[data.item.id].restock(this.entities.items[data.item.id].respawnTime)
  this.players[data.player.id].giveItem(data.item)
  this.eventEmitter.emit('remove item', data.item)
  this.eventEmitter.emit('update players', this.players)
}

Engine.prototype.playerTakeDamage = function(data) {
  this.players[data.player.id].takeDamage(data.value)
  this.eventEmitter.emit('on player take damage', data)
  this.eventEmitter.emit('update players', this.players)
}

Engine.prototype.playerDeath = function(data) {
  const newPosition = spawnPoints(Math.ceil(Math.random() * 4))
  this.players[data.player.id].playerDeath(data.enemy, this.players)
  this.players[data.player.id].health = 4
  this.eventEmitter.emit('on player death', {
    player: data.player,
    enemy: data.enemy,
    newX: newPosition.x,
    newY: newPosition.y,
  })
  this.eventEmitter.emit('update players', this.players)
}

export default Engine
