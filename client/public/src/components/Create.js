import React, {Component} from 'react';

import Logo from './Logo';

export default class Create extends Component {
  constructor() {
    super();
    this.state = {
      gameName: ''
    }
  }
  onChangeName = (e) => {
    this.setState({
      gameName: e.target.value
    })
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.props.createGame(this.state.gameName);
    this.props.loadJoinGamePage();
    this.setState({
      gameName: ''
    })
  }
  componentDidMount() {
    this.refs.gameName.focus()
  }
  render() {
    return (
      <div>
        <div className="sublogo">
          <Logo type={"home-heading"} />
        </div>
        <div className="newGameForm">
          <h3>Enter New Game Name</h3>
          <form onSubmit={this.onSubmit}>
            <input ref="gameName" type="text" value={this.state.gameName} onChange={this.onChangeName} />
          </form>
        </div>
        <div className='homepageButtonPleaseBehaveNowKThxBye'>
          <button className="gameButton" onClick={this.props.loadHomePage}>Back to homepage</button>
        </div>
      </div>
      )
  }
}
