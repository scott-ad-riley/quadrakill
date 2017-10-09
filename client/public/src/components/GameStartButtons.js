import React, { Component } from 'react';

import Button from './Button'

export default class GameStartButtons extends Component {
  constructor() {
    super();
  }
  render() {
    return (
        <div>
          <Button onClick={this.props.loadNewGamePage}>New Game</Button>
          <Button onClick={this.props.loadJoinGamePage}>Join Game</Button>
        </div>
      )
  }
}
