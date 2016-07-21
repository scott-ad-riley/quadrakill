import store from '../state-handling.js';

export default function loadJoinGamePage () {
  store.dispatch({
    type: 'NEW_PAGE',
    page: 'join_game'
  })
}