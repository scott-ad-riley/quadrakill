import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Logo from './Logo'
import Player from './Player'
import Button from './Button'
import Footer from './Footer'

import runGame, { leave } from '../canvas/main'
import quitGame from '../actions/quitGame'
import { disconnectGame } from '../canvas/socket'

class Game extends Component {
  componentDidMount() {
    runGame(this.refs.canvas.getContext('2d'), 768, 512, this.context.socket)
  }
  loadCanvas = () => {
    return <canvas height="512" width="768" ref="canvas" />
  }
  quitGame = () => {
    leave(this.context.socket) // clears engine and socket listeners
    disconnectGame(this.context.socket, this.props.game.id) // tells the server
    this.props.quitGame() // tells redux
  }
  render() {
    return (
      <div>
        <Logo type={'sub-page'} />

        <div id="playersLeftBorder">
          <Player number={1} />
          <Player number={3} />
        </div>

        <div className="" id="dungeonCanvas">
          {this.loadCanvas()}
        </div>

        <div id="playersRightBorder">
          <Player number={2} />
          <Player number={4} />
        </div>
        <div>
          <Button className="gameButton" onClick={this.quitGame}>
            Leave Game
          </Button>
          <Footer />
        </div>
      </div>
    )
  }
}

Game.contextTypes = {
  socket: PropTypes.object,
}

const mapStateToProps = ({ currentGame, currentGameInfo }) => {
  return {
    game: currentGame,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    quitGame: () => dispatch(quitGame),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
