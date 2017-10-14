import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Logo from './Logo'
import PlayerBox from './PlayerBox'
import Button from './Button'

import runGame, { leave } from '../canvas/main'
import quitGame from '../actions/quitGame'
import { disconnectGame } from '../canvas/socket'

var foo = require('../canvas/main')

class Game extends Component {
  componentDidMount() {
    runGame(this.refs.canvas.getContext('2d'), 768, 512)
  }
  loadCanvas = () => {
    return <canvas height="512" width="768" ref="canvas"></canvas>
  }
  quitGame = () => {
    leave() // clears engine and socket listeners
    disconnectGame(this.context.socket, this.props.game.id) // tells the server
    this.props.quitGame() // tells redux
  }
  keyWithNumber = (number) => {
    for (let eachPlayer in this.props.gameInfo.players) {
      if (this.props.gameInfo.players[eachPlayer].number === number) return eachPlayer;
    }
  }
  render() {
    let { players } = this.props.gameInfo;
    return (
      <div>
        <Logo type={"sub-page"} />

        <div id="players13Border">
          {(this.keyWithNumber(1)) ?
            <div id="player1" className="playerBorder">
              <PlayerBox player={players[this.keyWithNumber(1)]} />
            </div>
            : ""}
          {(this.keyWithNumber(3)) ?
            <div id="player3" className="playerBorder">
              <PlayerBox player={players[this.keyWithNumber(3)]} />
            </div>
            : ""}
        </div>

        <div className="" id="dungeonCanvas">
          {this.loadCanvas()}
        </div>

        <div id="players24Border">

          {(this.keyWithNumber(2)) ?
            <div id="player2" className="playerBorder">
              <PlayerBox player={players[this.keyWithNumber(2)]} />
            </div>
            : ""}

          {(this.keyWithNumber(3)) ?
            <div id="player4" className="playerBorder">
              <PlayerBox player={players[this.keyWithNumber(4)]} />
            </div>
            : ""}

        </div>
        <div className='footer'>
          <Button className="gameButton" onClick={this.quitGame}>Leave Game</Button>
          <p>&copy;2017 Scott Riley, Gordon Macintyre.</p>
        </div>
      </div>
    )
  }
}

Game.contextTypes = {
  socket: PropTypes.object
}

const mapStateToProps = ({ currentGame, currentGameInfo }) => {
  return {
    gameInfo: currentGameInfo,
    game: currentGame,
    actions: {}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    quitGame: () => dispatch(quitGame)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
