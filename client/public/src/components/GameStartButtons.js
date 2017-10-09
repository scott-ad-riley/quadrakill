import React, { Component } from 'react'
import { connect } from 'react-redux'

import newGame from '../actions/loadNewGamePage'
import joinGame from '../actions/loadJoinGamePage'
import Button from './Button'

class GameStartButtons extends Component {
  render() {
    return (
        <div>
          <Button onClick={this.props.newGame}>New Game</Button>
          <Button onClick={this.props.joinGame}>Join Game</Button>
        </div>
      )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => (
  {
    newGame: () => dispatch(newGame),
    joinGame: () => dispatch(joinGame)
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(GameStartButtons)
