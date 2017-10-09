import React, {Component} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import Create from './Create';
import Join from './Join';
import Game from './Game';
import Logo from './Logo';
import GameStartButtons from './GameStartButtons';

import { setupAssets } from '../canvas/main';

class Main extends Component {
  componentDidMount() {
    setupAssets()
  }
  getChildContext() {
    return { socket: this.props.socket }
  }
  render() {
    switch (this.props.currentPage) {
      case 'new_game':
        return <Create />
      case 'join_game':
        return <Join />
      case 'game':
        return <Game />
      case 'home':
      default:
        return (
          <div>
            <Logo type={"home-heading"} />
            <GameStartButtons />
          </div>
        )
    }
  }
}

Main.childContextTypes = {
  socket: PropTypes.object
}

const mapStateToProps = ({ page, currentGame, currentGameInfo }) => {
  return {
    currentPage: page,
    currentGameInfo: currentGameInfo,
    currentGame: currentGame,
    actions: {}
  }
}

export default connect(mapStateToProps)(Main)
