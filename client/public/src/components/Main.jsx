import React, {Component} from 'react';

import Create from './Create';
import Join from './Join';
import Game from './Game';
import Logo from './Logo';
import GameStartButtons from './GameStartButtons';

import {setupAssets} from '../canvas/main';

export default class Main extends Component {
  componentDidMount() {
    setupAssets()
  }
  render() {
    switch (this.props.state.page) {
      case 'new_game':
        return <Create 
                  loadJoinGamePage={this.props.actions.loadJoinGamePage}
                  loadHomePage={this.props.actions.loadHomePage}
                  createGame={this.props.socket.createGame} />
      case 'join_game':
        return <Join
                  games={this.props.state.games}
                  joinGame={this.props.socket.joinGame}
                  loadGamePage={this.props.actions.joinGame}
                  loadHomePage={this.props.actions.loadHomePage} />
      case 'game':
        return <Game
                  disconnectGame={this.props.socket.disconnectGame}
                  quitGame={this.props.actions.quitGame}
                  gameInfo={this.props.state.currentGameInfo}
                  game={this.props.state.currentGame} />
      case 'home':
      default:
        return (
          <div>
            <Logo type={"home-heading"} />
            <GameStartButtons
              loadNewGamePage={this.props.actions.loadNewGamePage}
              loadJoinGamePage={this.props.actions.loadJoinGamePage} />
          </div>
        )
    }
  }
}