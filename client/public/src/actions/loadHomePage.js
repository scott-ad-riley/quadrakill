import store from '../state-handling.js';

export default function loadHomePage () {
  store.dispatch({
    type: 'NEW_PAGE',
    page: 'home'
  })
  
}