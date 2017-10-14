//MAP DATA
import mapTilesData from './config/MapTilesData'
import mapObjectsData from './config/MapObjectsData'
import mapItemsData from './config/MapItemsData'

//MODELS
var Player = require('./models/Player')
var Bullet = require('./models/Bullet')
var MapTiles = require('./models/MapTiles')
var MapObjects = require('./models/MapObjects')
var MapItems = require('./models/MapItems')
var Projectiles = require('./models/Projectiles')

//FACTORIES
var MapObjectFactory = require('./utils/MapObjectFactory')
var MapItemFactory = require('./utils/MapItemFactory')

//HELPERS/DEFAULTS
var Keys = require('./utils/keys')
var assetsHelpers = require('./config/assets')
var debounce = require('./utils/debounce')
var getDirection = require('./utils/getDirection')
import spawnPoints from './utils/spawnPoints'

//SOUND FX
var playSound = require('./utils/playSound.js')

// GLOBALS
var player,
  map,
  projectiles,
  mapObjects,
  mapItems,
  bullets,
  startTime,
  raf,
  ctx,
  canvas = {},
  assets,
  keys,
  players = {},
  sounds,
  gameLive

var outgoingListeners = {
  onPlayerMove: null,
  onPlayerFire: null,
  onWeaponPickup: null,
  onItemPickup: null,
  onPlayerTakeDamage: null,
  onPlayerDied: null,
}

var handleKeyDown = function(e) {
  if (keys.valid.indexOf(e.keyCode) > -1) keys.onKeyDown(e)
}

var handleKeyUp = function(e) {
  if (keys.valid.indexOf(e.keyCode) > -1) keys.onKeyUp(e)
}

var updatePlayers = function(playersHash) {
  for (let eachPlayer in playersHash) {
    let i = playersHash[eachPlayer]
    if (player.id !== i.id) {
      // if the new player's socket id isn't the same as this client's
      if (!players[i.id]) {
        // if the new player isn't in the current client's game
        players[i.id] = new Player(i.x, i.y, assets['player' + i.number])
        players[i.id].id = i.id // yep thats real
        players[i.id].number = i.number
        players[i.id].spawned = true
      } else {
        players[i.id].updateWeaponState(i)
      }
    } else if (!player.spritesLoaded) {
      player.number = i.number
      player.loadSprites(assets['player' + player.number])
      player.setPosition(spawnPoints[i.number])
    } else {
      // do the ammo/weapon update
      player.updateWeaponState(i)
    }
  }
  delete playersHash[player.id]
  let remotePlayerIDs = Object.keys(playersHash)
  for (let eachPlayer in players) {
    if (remotePlayerIDs.indexOf(eachPlayer) === -1) {
      delete players[eachPlayer]
    }
  }
}

var updatePlayer = function(updatedPlayer) {
  players[updatedPlayer.id].x = updatedPlayer.x
  players[updatedPlayer.id].y = updatedPlayer.y
  players[updatedPlayer.id].hsp = updatedPlayer.hsp
  players[updatedPlayer.id].vsp = updatedPlayer.vsp
}

var createBullet = function(bulletData) {
  let args = {
    player: {
      x: bulletData.x,
      y: bulletData.y,
    },
    speed: {
      hsp: bulletData.hsp,
      vsp: bulletData.vsp,
    },
  }
  let newBullet = new Bullet(args, players[bulletData.owner.id], bulletData.damage)
  players[bulletData.owner.id].setOrientation(getDirection(bulletData))
  bullets.items.push(newBullet)
}

var socketPlayerFired = function(bullet) {
  if (outgoingListeners.onPlayerFire) {
    outgoingListeners.onPlayerFire(bullet)
  }
}

var socketPlayerMoved = debounce(
  function() {
    if (outgoingListeners.onPlayerMove) {
      outgoingListeners.onPlayerMove(player)
    }
  },
  8,
  true,
) // can tweak this value in future, 8 seems to be ok

var socketWeaponPickedUp = function(weapon) {
  if (outgoingListeners.onWeaponPickup) {
    outgoingListeners.onWeaponPickup({ player: player, weapon: weapon })
  }
}

var socketItemPickedUp = function(item) {
  if (outgoingListeners.onItemPickup) {
    outgoingListeners.onItemPickup({ player: player, item: item })
  }
}

var socketTakeDamage = function(value) {
  if (outgoingListeners.onTakeDamage) {
    outgoingListeners.onTakeDamage({ value: value, player: player })
  }
}

var socketPlayerDied = function(enemy) {
  if (outgoingListeners.onPlayerDied) {
    outgoingListeners.onPlayerDied({ player: player, enemy: enemy })
  }
}

var weaponGone = function(weapon) {
  mapItems.weapons[weapon.id].active = false
  mapItems.weapons[weapon.id].restock()
}

var itemGone = function(item) {
  mapItems.items[item.id].active = false
  mapItems.items[item.id].restock()
}

var playerTakeDamage = function(data) {
  players[data.player.id].takeDamage(data.value)
}

var playerDied = function(data) {
  if (player.id !== data.player.id) {
    // players[data.player.id].playerDeath(data.enemy);
    setTimeout(() => {
      players[data.player.id].respawn(data.newX, data.newY)
    }, 1000)
  } else {
    setTimeout(() => {
      player.respawn(data.newX, data.newY)
    }, 1000)
  }
}

var addPlayerID = function(playerID) {
  player.id = playerID
}

const quitGame = function() {
  gameLive = false
}

keys = new Keys()

var loadAssets = (spriteUrls, soundUrls) => {
  assetsHelpers.loadSprites(spriteUrls, spritesArray => {
    assets = assetsHelpers.mapSprites(spritesArray)
  })
  assetsHelpers.loadSounds(soundUrls, soundsArray => {
    sounds = assetsHelpers.mapSounds(soundsArray)
  })
}

//SETUP
var setup = (canvasWidth, canvasHeight, reqAnimFrame, context, setupListenersCallback) => {
  raf = reqAnimFrame
  ctx = context
  startTime = Date.now()
  canvas.height = canvasHeight
  canvas.width = canvasWidth
  player = new Player(
    canvasWidth / 2,
    canvasHeight / 2,
    null,
    socketTakeDamage,
    socketPlayerDied,
    true,
  )
  map = new MapTiles(mapTilesData, assets.tiles)
  var mapObjectMappings = {
    11: MapObjectFactory.wall,
    22: MapObjectFactory.dynamic['lava'],
    33: MapObjectFactory.dynamic['mud'],
    44: MapObjectFactory.dynamic['ice'],
  }
  mapObjects = new MapObjects(mapObjectsData, mapObjectMappings)
  var mapItemMappings = {
    22: MapItemFactory.weapon['assault'],
    33: MapItemFactory.weapon['shotgun'],
    44: MapItemFactory.item['health'],
    55: MapItemFactory.item['overshield'],
    66: MapItemFactory.item['speedBoost'],
    77: MapItemFactory.item['cloak'],
  }
  mapItems = new MapItems(mapItemsData, mapItemMappings)
  bullets = new Projectiles('sprites/tiles/bullet.png')
  gameLive = true
  setupListenersCallback()
  main()
}

// UPDATE - RUN MULTIPLE TIMES A SECOND!
var update = function(delta) {
  for (let eachPlayer in players) {
    // players[eachPlayer].calculateWallCollisions(mapObjects.collideable);
    // players[eachPlayer].calculateObjectCollisions(mapObjects.passable);
    players[eachPlayer].calculateDirection({})
    players[eachPlayer].calculateVsp()
    players[eachPlayer].calculateHsp()
    players[eachPlayer].moveX(delta)
    players[eachPlayer].moveY(delta)
    players[eachPlayer].status()
  }
  //UPDATE PLAYER POSITION / PASS IN MOVE-KEYS
  player.calculateDirection(keys.state().movement)
  player.calculateVsp()
  player.calculateHsp()
  //WALL COLLISIONS
  player.calculateWallCollisionsVertical(mapObjects.collideable)
  player.moveY(delta)
  player.calculateWallCollisionsHorizontal(mapObjects.collideable)
  player.moveX(delta)

  //OBJECT COLLISIONS
  player.calculateObjectCollisions(mapObjects.passable)
  //GET SHOT
  var collidedBullet = player.bulletImpact(bullets.items)
  if (collidedBullet) bullets.items.splice(bullets.items.indexOf(collidedBullet), 1)
  //PICK UP WEAPONS
  var weapon = player.weaponPickUp(mapItems.weapons)
  if (weapon) socketWeaponPickedUp(weapon)
  //PICK UP ITEMS
  var item = player.itemPickUp(mapItems.items)
  if (item) socketItemPickedUp(item)
  //CHECK STATUS
  player.status()

  let { up, down, left, right } = keys.state().movement
  if (up || down || left || right) {
    socketPlayerMoved()
  }

  // NEW UP BULLET AND FIRE IN DIRECTION
  if (player.canFire()) {
    // Could loop here/make this code more DRY, but would just involve a loop
    if (keys.state().shooting.up) {
      var newBullet = player.fireBullet('up')
      socketPlayerFired(newBullet)
      bullets.items.push(newBullet)
    }
    if (keys.state().shooting.down) {
      var newBullet = player.fireBullet('down')
      socketPlayerFired(newBullet)
      bullets.items.push(newBullet)
    }
    if (keys.state().shooting.left) {
      var newBullet = player.fireBullet('left')
      socketPlayerFired(newBullet)
      bullets.items.push(newBullet)
    }
    if (keys.state().shooting.right) {
      var newBullet = player.fireBullet('right')
      socketPlayerFired(newBullet)
      bullets.items.push(newBullet)
    }
  }
  //UPDATE BULLETS X/Y && DELETE WHEN OFF MAP
  // bulletUpdate();
  bullets.items.forEach(function(bullet) {
    bullet.move()
  })
  //DESTROY BULLETS THAT ARE OFF CANVAS
  bullets.detectOffCanvas(canvas.height, canvas.width)
  //DESTROY BULLETS THAT IMPACT WITH mapObjects
  bullets.detectWallCollisions(mapObjects.collideable)
  //DESTROY BULLETS THAT IMPACT WITH players
  bullets.detectPlayerCollisions(players)
}

//DRAW IMAGES - run constantly
var render = function(ctx) {
  var xPos = 0
  var yPos = 0
  map.render(xPos, yPos, ctx)
  mapItems.render(ctx)
  bullets.render(ctx)
  player.render(ctx)
  for (let eachPlayer in players) {
    players[eachPlayer].render(ctx)
  }
}

//GAME LOOP
var main = function(currentDelta) {
  var now = Date.now()
  var delta = now - startTime
  update(currentDelta / 20)
  render(ctx)
  startTime = now
  // repeat
  console.log('doing a main')
  raf(() => {
    if (gameLive) main(delta)
  })
}

module.exports.setup = setup
module.exports.engine = {
  incoming: {
    updatePlayers: updatePlayers,
    updatePlayer: updatePlayer,
    addPlayerID: addPlayerID,
    createBullet: createBullet,
    weaponGone: weaponGone,
    itemGone: itemGone,
    playerTakeDamage: playerTakeDamage,
    playerDied: playerDied,
    quitGame: quitGame,
  },
  outgoing: outgoingListeners,
  setupKeyListeners: function() {
    window.addEventListener('keydown', handleKeyDown, false)
    window.addEventListener('keyup', handleKeyUp, false)
  },
  clearKeyListeners: function() {
    console.log('cleared listeners!')
    window.removeEventListener('keydown', handleKeyDown, false)
    window.removeEventListener('keyup', handleKeyUp, false)
  },
}
module.exports.loadAssets = loadAssets
