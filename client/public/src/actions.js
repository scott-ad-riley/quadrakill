// probably a nicer ES6 way of doing this with spread operator or something
import loadNewGamePage from './actions/loadNewGamePage.js';
import loadJoinGamePage from './actions/loadJoinGamePage.js';
import loadHomePage from './actions/loadHomePage.js';
import joinGame from './actions/joinGame.js';
import quitGame from './actions/quitGame.js';
import refreshGames from './actions/refreshGames.js';
import refreshPlayers from './actions/refreshPlayers.js';

export default {
  loadNewGamePage: loadNewGamePage,
  loadJoinGamePage: loadJoinGamePage,
  loadHomePage: loadHomePage,
  joinGame: joinGame,
  quitGame: quitGame,
  refreshGames: refreshGames,
  refreshPlayers: refreshPlayers
};