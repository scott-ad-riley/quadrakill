import store from '../state-handling.js';

export default function loadHomePage (games) {
  store.dispatch({
    type: 'REFRESH_GAMES',
    games: games
  })
  
}