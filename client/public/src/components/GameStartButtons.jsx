import React, { Component } from 'react';

import Button from './Button.jsx'

export default class GameStartButtons extends Component {
  constructor() {
    super();
  }
  render() {
    return (
        <div>
          <a onClick={this.props.loadNewGamePage}>
            <Button className="gameButton" parent={"homepage"}>New Game</Button>
          </a>
          <a onClick={this.props.loadJoinGamePage}>
            <Button className="gameButton" parent={"homepage"}>Join Game</Button>
          </a>          
        </div>
      )
  }
}