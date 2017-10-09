import React, {Component} from 'react';

import Logo from './Logo';
import PlayerBox from './PlayerBox';
import Button from './Button';

import runGame, { leave } from '../canvas/main';

var foo = require('../canvas/main');

export default class Game extends Component {
  componentDidMount() {
    runGame(this.refs.canvas.getContext('2d'), 768, 512)
  }
  loadCanvas = () => {
    return <canvas height="512" width="768" ref="canvas"></canvas>
  }
  quitGame = () => {
    leave() // clears engine and socket listeners
    this.props.disconnectGame(this.props.game.id) // tells the server
    this.props.quitGame() // tells redux
  }
  keyWithNumber = (number) => {
    for (let eachPlayer in this.props.gameInfo.players) {
      if (this.props.gameInfo.players[eachPlayer].number === number) return eachPlayer;
    }
  }
  render() {
    let {players} = this.props.gameInfo;
    return (
      <div>
        <Logo type={"sub-page"} />

          <div id="players13Border">
            {(this.keyWithNumber(1)) ?
              <div id="player1" className ="playerBorder">
                <PlayerBox player={players[this.keyWithNumber(1)]} />
              </div>
              : ""}
            {(this.keyWithNumber(3)) ?
                <div id="player3" className ="playerBorder">
                  <PlayerBox player={players[this.keyWithNumber(3)]} />
                </div>
                : ""}
          </div>

          <div className="" id="dungeonCanvas">
            {this.loadCanvas()}
          </div>

          <div id="players24Border">

              {(this.keyWithNumber(2)) ?
                <div id="player2" className ="playerBorder">
                  <PlayerBox player={players[this.keyWithNumber(2)]} />
                </div>
                : ""}

              {(this.keyWithNumber(3)) ?
                <div id="player4" className ="playerBorder">
                  <PlayerBox player={players[this.keyWithNumber(4)]} />
                </div>
                : ""}

          </div>
          <div id='lulz'>
            <Button className="gameButton" onClick={this.quitGame}>Leave Game</Button>
            <p>&copy;2016 Scott Riley, Gordon Macintyre. Arts pinched from the Googletron. Sounds from bfxr.net / MetalSlug 3</p>
            <p>#StannisIsTheOneTrueKingofWesteros</p>
          </div>
      </div>
      )
  }
}


// <button id="quitButton" onClick={::this.quitGame}>Quit Game</button> //stop getting in the way!!




