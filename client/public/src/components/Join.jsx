import React, {Component} from 'react';

import Logo from './Logo';
import JoinGame from './JoinGame';

export default class JoinList extends Component {
  renderGame(key, index) {
    return <JoinGame key={index} onClick={this.joinGame(key)}>{key}</JoinGame>
  }
  joinGame(gameName) {
    return () => {
      this.props.joinGame(gameName)
      this.props.loadGamePage(this.props.games[gameName])
    }
  }
  render() {
    return (
      <div>
        <div className="sublogo">
          <Logo type={"home-heading"} />
        </div>
        <div id="activeGamesList">
          <h3>Open Games</h3>
          <ul className="gameList">
            {
              Object.keys(this.props.games).map(::this.renderGame)
            }
          </ul>
        </div>
        <div className='homepageButtonPleaseBehaveNowKThxBye'>
          <button className="gameButton" onClick={this.props.loadHomePage}>Back to homepage</button>
        </div>
      </div>
      )
  }
}
              // this.props.games.map(::this.renderGame)