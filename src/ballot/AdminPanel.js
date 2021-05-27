import React from 'react';
import { Component } from 'react';

export default class AdminPanel extends Component {

  render() {
    return (
      <div className="AdminPanel panel">
        hello, admin!
        <button onClick={this.props.onEndVote} disabled={Boolean(this.props.winners)}>End vote!</button>
      </div>
    );
  }

}