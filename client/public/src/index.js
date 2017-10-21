import React from 'react'
import { render } from 'react-dom'
import { gid } from 'short-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { Main } from './components.js'
import gameReducer from './game-reducer.js'

import refreshGames from './actions/refreshGames'
import refreshPlayers from './actions/refreshPlayers'

import { IN } from './canvas/events'

import { connect } from './canvas/socket.js'

window.onload = () => {
  const socket = connect()

  const store = createStore(gameReducer)

  socket.on(IN.GAMES_REFRESH, games => {
    store.dispatch(refreshGames(games))
  })

  socket.on(IN.UPDATE_PLAYERS, players => {
    store.dispatch(refreshPlayers(players))
  })

  render(
    <Provider store={store}>
      <Main socket={socket} />
    </Provider>,
    gid('root'),
  )
}
