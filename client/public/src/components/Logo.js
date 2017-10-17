import React, { Component } from 'react'

export default class Logo extends Component {
  render() {
    return <h1 className={this.props.type + ' clip-text clip-text_one'}>Quadrakill</h1>
  }
}
