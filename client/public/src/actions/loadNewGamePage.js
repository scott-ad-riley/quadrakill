import store from '../state-handling.js';

export default function loadNewGamePage () {
  store.dispatch({
    type: 'NEW_PAGE',
    page: 'new_game'
  })
  
}