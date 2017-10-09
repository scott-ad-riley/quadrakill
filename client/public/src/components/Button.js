import React, {Component} from 'react';
export default class Button extends Component {
  onClick = () => {
    if (this.props.onClick) this.props.onClick();
  }
  render() {
    return (
        <button className="gameButton" onClick={this.onClick}>{this.props.children}</button>
      )
  }
}
