import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Logo from './Logo'
import loadJoinGamePage from '../actions/loadJoinGamePage'
import loadHomePage from '../actions/loadHomePage'

import { createGame } from '../canvas/socket'

class Create extends Component {
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
    createGame(this.context.socket, this.state.gameName)
    this.props.loadJoinGamePage();
    this.setState({ // TODO: this feels redundant?
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
        <div className='homepageButton'>
          <button className="gameButton" onClick={this.props.loadHomePage}>Back to homepage</button>
        </div>
      </div>
      )
  }
}

Create.contextTypes = {
  socket: PropTypes.object
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => {
  return {
    loadJoinGamePage: () => dispatch(loadJoinGamePage),
    loadHomePage: () => dispatch(loadHomePage)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create)
