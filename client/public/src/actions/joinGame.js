import store from '../state-handling.js';

export default function joinGame (game) {
  store.dispatch({
    type: 'JOIN_GAME',
    game: game
  })
  
}