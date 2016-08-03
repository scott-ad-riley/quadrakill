import store from '../state-handling.js';

import _ from 'lodash';

export default function refreshPlayers (players) {
  store.dispatch({
    type: 'REFRESH_PLAYERS',
    players: players
  })  
}