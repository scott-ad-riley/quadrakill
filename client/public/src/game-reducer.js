import _ from 'lodash'

const defaultState = {
  games: {},
  page: 'home',
  currentGame: null,
  currentGameInfo: {
    players: {},
    areDead: false,
  },
}

export default function gameReducer(state = defaultState, action) {
  switch (action.type) {
    case 'REFRESH_GAMES':
      return { ...state, games: action.games }
    case 'NEW_PAGE':
      return { ...state, page: action.page }
    case 'JOIN_GAME':
      return { ...state, page: 'game', currentGame: action.game }
    case 'QUIT_GAME':
      return { ...state, page: 'join_game', currentGame: null }
    case 'REFRESH_PLAYERS':
      const newGameInfo = { ...state.currentGameInfo, players: _.cloneDeep(action.players) }
      return { ...state, currentGameInfo: newGameInfo }
    default:
      return state
  }
}
