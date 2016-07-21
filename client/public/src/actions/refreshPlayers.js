import store from '../state-handling.js';

import _ from 'lodash';

export default function refreshPlayers (players) {
  let newPlayers = {}
  for (let eachPlayer in players) {
    newPlayers[eachPlayer] = _.cloneDeep(players[eachPlayer]);
  }
  store.dispatch({
    type: 'REFRESH_PLAYERS',
    players: newPlayers
  })
  
}