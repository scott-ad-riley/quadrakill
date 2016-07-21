const defaultState = {
  games: {},
  page: "home",
  currentGame: null,
  currentGameInfo: {
    players: {},
    areDead: false
  }
}

export default function gameReducer(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_GAME':
      return state.concat([action.room])
    case 'REMOVE_GAME':
      const index = state.games.indexOf(action.room);
      state.games = [
          ...state.games.slice(0, index),
          ...state.games.slice(index + 1)
      ]
      return state
    case 'REFRESH_GAMES':
      state.games = action.games;
      return state;
    case 'NEW_PAGE':
      state.page = action.page;
      return state;
    case 'JOIN_GAME':
      state.page = 'game';
      state.currentGame = action.game;
      return state;
    case 'QUIT_GAME':
      state.page = 'join_game';
      state.currentGame = null;
      return state;
    case 'REFRESH_PLAYERS':
      state.currentGameInfo.players = action.players
      return state;
    default:
      return state
  }
}