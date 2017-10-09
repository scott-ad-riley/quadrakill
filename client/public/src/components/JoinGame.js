import React, {Component} from 'react';


export default class JoinGame extends Component {
  render() {
    return <li onClick={this.props.onClick}>{this.props.children}</li>
  }
}