import React from 'react';
import { render as reactRender } from 'react-dom';
import { gid } from 'short-dom';

import store from './state-handling.js';
import { Main, Create, Join, Options } from './components.js';

import actions from './actions.js';

import { connect, socketActions, createSocketListener} from './canvas/socket.js';

window.onload = () => {

  connect()

  createSocketListener('games refresh', (games) => {
    console.log("told to refresh games")
    actions.refreshGames(games)
  })

  createSocketListener('test event', (data) => {
    console.log('received test event', data)
  })

  const render = () => {
    reactRender(
        <Main
          state={store.getState()}
          actions={actions}
          socket={socketActions}
          createSocketListener={createSocketListener}
          />,
        gid('app')
      )
  };

  render();
  store.subscribe(render);
}

