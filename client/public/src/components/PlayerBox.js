import React, {Component} from 'react'

import weaponNames from '../../../engine/utils/weaponNames'

import { getID } from '../canvas/socket'

export default class PlayerBox extends Component {
  render() {
    if (this.props.player) {

      let weapon = weaponNames[this.props.player.weaponNum]
      let activePlayerBox = getID() === this.props.player.id

      return (
        <div className={(activePlayerBox) ? "activePlayerBox" : "bar"}>
          <h3>PLAYER {this.props.player.number}</h3>
          <p><i>K:D</i> {this.props.player.killCount}:{this.props.player.deathCount}</p>
          <p>--------</p>
          <p><i>HP:</i> {this.props.player.health}</p>
          <p>--------</p>
          <p>{weapon}</p>
          <p>{this.props.player.bulletCount}</p>
        </div>
      )
    }
    return <span />
  }
}
