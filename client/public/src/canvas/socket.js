import io from 'socket.io-client';

import actions from '../actions';
let socket = null;
export function connect () {
  socket = io('http://localhost:8080'); // change this to your local IP when playing across multiple machines
}

export function getID() {
  return socket.id;
}

export function createSocketListener (eventName, callback) {
  socket.on(eventName, callback);
}

// probably want a removeSocketListener too

// these are communications from react to the socket server
export const socketActions = {
  createGame: (gameName) => {
    socket.emit('create game', gameName);
  },
  joinGame: (gameId) => {
    socket.emit('join game', gameId);
  },
  disconnectGame: (gameId) => {
    socket.emit('quit game', gameId);
  },
  // probably not needed... kinda dangerous
  gameEvent: (eventName, data) => {
    socket.emit(eventName, data)
  }
}

// these are communications from the canvas to the socket server
export function setupListeners (engine) {
  engine.incoming.addPlayerID(socket.id);
  // listeners to update the engine, from the server
  socket.on('update players', actions.refreshPlayers)
  socket.on('update players', engine.incoming.updatePlayers)
  socket.on('update player', engine.incoming.updatePlayer)
  socket.on('create bullet', engine.incoming.createBullet)
  socket.on('remove weapon', engine.incoming.weaponGone)
  socket.on('remove item', engine.incoming.itemGone)
  socket.on('player take damage', engine.incoming.playerTakeDamage)
  socket.on('remote player died', engine.incoming.playerDied)

  // listeners to update the server, from the engine
  engine.outgoing.onPlayerMove = (player) => {
    socket.emit('player moved', player)
  }

  engine.outgoing.onPlayerFire = (bullet) => {
    socket.emit('bullet fired', bullet)
  }

  engine.outgoing.onWeaponPickup = (data) => {
    socket.emit('weapon picked up', data)
  }

  engine.outgoing.onItemPickup = (item) => {
    socket.emit('item picked up', item)
  }

  engine.outgoing.onTakeDamage = (data) => {
    socket.emit('player take damage', data)
  }

  engine.outgoing.onPlayerDied = (data) => {
    socket.emit('player has died', data)
  }
}