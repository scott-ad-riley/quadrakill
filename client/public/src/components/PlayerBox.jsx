import React, {Component} from 'react';

export default class PlayerBox extends Component {
  render() {
    if (this.props.player) {
      var currentWeapon;
      if(this.props.player.weaponNum===1){
        currentWeapon = "PISTOL";
      } else if (this.props.player.weaponNum===2){
        currentWeapon = "RC-P90";
      } else if (this.props.player.weaponNum===3){
        currentWeapon = "SHOTGUN";
      }

      return (
          <div>
            <h3>PLAYER {this.props.player.number}</h3>
            <p><i>K:D</i> {this.props.player.killCount}:{this.props.player.deathCount}</p>
            <p>--------</p>
            <p><i>HP:</i> {this.props.player.health}</p>
            <p>--------</p>
            <p>{currentWeapon}</p>
            <p>{this.props.player.bulletCount}</p>
          </div>
        )
    }
    return <span />
  }
}