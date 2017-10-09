import React from 'react';
import { render } from 'react-dom';
import { gid } from 'short-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux';

import { Main } from './components.js';
import gameReducer from './game-reducer.js'

import refreshGames from './actions/refreshGames'
import refreshPlayers from './actions/refreshPlayers'

import { connect } from './canvas/socket.js';

window.onload = () => {

  const socket = connect()

  const store = createStore(gameReducer)

  socket.on('games refresh', (games) => {
    store.dispatch(refreshGames(games))
  })

  socket.on('update players', (players) => {
    store.dispatch(refreshPlayers(players))
  })

  render(
    <Provider store={store}>
      <Main socket={socket} />
    </Provider>,
    gid('app')
  )
}

