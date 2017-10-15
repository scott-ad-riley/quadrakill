import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import PropTypes from 'prop-types'

import weaponNames from '../../../engine/utils/weaponNames'

import { getID } from '../canvas/socket'

class Player extends Component {
  render() {
    if (!this.props.isInGame) return <span />

    let weapon = weaponNames[this.props.player.weaponNum]
    return (
      <div id="player1" className="playerBorder">
        <div className={this.props.isUser(this.context.socket) ? 'activePlayerBox' : 'bar'}>
          <h3>PLAYER {this.props.player.number}</h3>
          <p>
            <i>K:D</i> {this.props.player.killCount}:{this.props.player.deathCount}
          </p>
          <p>--------</p>
          <p>
            <i>HP:</i> {this.props.player.health}
          </p>
          <p>--------</p>
          <p>{weapon}</p>
          <p>{this.props.player.bulletCount}</p>
        </div>
      </div>
    )
  }
}

Player.contextTypes = {
  socket: PropTypes.object,
}

const mapStateToProps = ({ currentGameInfo }, { number }) => {
  if (_.isEmpty(currentGameInfo.players)) return { isInGame: false }
  return {
    isInGame: Object.values(currentGameInfo.players)
      .map(p => p.number)
      .includes(number),
    player: Object.values(currentGameInfo.players).find(p => p.number === number),
    isUser: socket => currentGameInfo.players[getID(socket)].number === number,
  }
}

export default connect(mapStateToProps)(Player)
