import store from '../state-handling.js';

export default function quitGame () {
  store.dispatch({
    type: 'QUIT_GAME'
  }) 
}