import io from 'socket.io-client'

import { IN, OUT } from './events'

export function connect() {
  if (window.location.hostname === 'localhost') {
    return io('http://localhost:8080')
  } else {
    return io('http://quadrakill-server.placeofthin.gs')
  }
}

export function getID(socket) {
  return socket.id
}

// these are communications from react to the socket server
export const createGame = (socket, gameName) => {
  socket.emit(OUT.CREATE_GAME, gameName)
}

export const joinGame = (socket, gameId) => {
  socket.emit(OUT.JOIN_GAME, gameId)
}

export const disconnectGame = (socket, gameId) => {
  socket.emit(OUT.QUIT_GAME, gameId)
}

// these are communications from the canvas to the socket server
export function setupListeners(engine, socket) {
  return () => {
    engine.incoming.addPlayerID(socket.id)
    engine.setupKeyListeners()
    // listeners to update the engine, from the server
    socket.on(IN.UPDATE_PLAYERS, engine.incoming.updatePlayers)
    socket.on(IN.UPDATE_PLAYER, engine.incoming.updatePlayer)
    socket.on(IN.CREATE_BULLET, engine.incoming.createBullet)
    socket.on(IN.REMOVE_WEAPON, engine.incoming.weaponGone)
    socket.on(IN.REMOVE_ITEM, engine.incoming.itemGone)
    socket.on(IN.PLAYER_TAKE_DAMAGE, engine.incoming.playerTakeDamage)
    socket.on(IN.REMOTE_PLAYER_DIED, engine.incoming.playerDied)

    // listeners to update the server, from the engine
    engine.outgoing.onPlayerMove = player => {
      socket.emit(OUT.PLAYER_MOVED, player)
    }

    engine.outgoing.onPlayerFire = bullet => {
      socket.emit(OUT.BULLET_FIRED, bullet)
    }

    engine.outgoing.onWeaponPickup = data => {
      socket.emit(OUT.WEAPON_PICKED_UP, data)
    }

    engine.outgoing.onItemPickup = item => {
      socket.emit(OUT.ITEM_PICKED_UP, item)
    }

    engine.outgoing.onTakeDamage = data => {
      socket.emit(OUT.PLAYER_TAKE_DAMAGE, data)
    }

    engine.outgoing.onPlayerDied = data => {
      socket.emit(OUT.PLAYER_HAS_DIED, data)
    }
  }
}

export function clearListeners(engine, socket) {
  socket.off(IN.UPDATE_PLAYERS)
  socket.off(IN.UPDATE_PLAYER)
  socket.off(IN.CREATE_BULLET)
  socket.off(IN.REMOVE_WEAPON)
  socket.off(IN.REMOVE_ITEM)
  socket.off(IN.PLAYER_TAKE_DAMAGE)
  socket.off(IN.REMOTE_PLAYER_DIED)
  engine.outgoing.onPlayerMove = null
  engine.outgoing.onPlayerFire = null
  engine.outgoing.onWeaponPickup = null
  engine.outgoing.onItemPickup = null
  engine.outgoing.onTakeDamage = null
  engine.outgoing.onPlayerDied = null
  engine.clearKeyListeners() // clears key listeners in the engine
}
