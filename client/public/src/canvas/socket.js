import io from 'socket.io-client'

const actions = {} // going soon
let socket = null
export function connect() {
  if (window.location.hostname === 'localhost') {
    socket = io('http://localhost:8080')
    return socket
  } else {
    socket = io('http://crossfire-server.placeofthin.gs')
    return socket
  }
}

export function getID() {
  return socket.id
}

// these are communications from react to the socket server
export const createGame = (_socket, gameName) => {
  _socket.emit('create game', gameName)
}

export const joinGame = (_socket, gameId) => {
  _socket.emit('join game', gameId)
}

export const disconnectGame = (_socket, gameId) => {
  _socket.emit('quit game', gameId)
}

// these are communications from the canvas to the socket server
export function setupListeners(engine) {
  return () => {
    engine.incoming.addPlayerID(socket.id)
    engine.setupKeyListeners()
    // listeners to update the engine, from the server
    socket.on('update players', engine.incoming.updatePlayers)
    socket.on('update player', engine.incoming.updatePlayer)
    socket.on('create bullet', engine.incoming.createBullet)
    socket.on('remove weapon', engine.incoming.weaponGone)
    socket.on('remove item', engine.incoming.itemGone)
    socket.on('player take damage', engine.incoming.playerTakeDamage)
    socket.on('remote player died', engine.incoming.playerDied)

    // listeners to update the server, from the engine
    engine.outgoing.onPlayerMove = player => {
      socket.emit('player moved', player)
    }

    engine.outgoing.onPlayerFire = bullet => {
      socket.emit('bullet fired', bullet)
    }

    engine.outgoing.onWeaponPickup = data => {
      socket.emit('weapon picked up', data)
    }

    engine.outgoing.onItemPickup = item => {
      socket.emit('item picked up', item)
    }

    engine.outgoing.onTakeDamage = data => {
      socket.emit('player take damage', data)
    }

    engine.outgoing.onPlayerDied = data => {
      socket.emit('player has died', data)
    }
  }
}

export function clearListeners(engine) {
  socket.off('update players')
  socket.off('update players')
  socket.off('update player')
  socket.off('create bullet')
  socket.off('remove weapon')
  socket.off('remove item')
  socket.off('player take damage')
  socket.off('remote player died')
  engine.outgoing.onPlayerMove = null
  engine.outgoing.onPlayerFire = null
  engine.outgoing.onWeaponPickup = null
  engine.outgoing.onItemPickup = null
  engine.outgoing.onTakeDamage = null
  engine.outgoing.onPlayerDied = null
  engine.clearKeyListeners() // clears key listeners in the engine
}
