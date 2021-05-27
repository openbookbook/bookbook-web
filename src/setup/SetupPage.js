import { Component } from 'react';
import { createBallot, updateBallot } from '../utils/backend-api';
import BookSuggest from './BookSuggest';
import './SetupPage.css';

export default class SetupPage extends Component {

  state = {
    ballot: {},
    enableVoteCodeInput: false
  }

  async componentDidMount() {
    try {
      const ballot = await createBallot();
      this.setState({ ballot: ballot });
    }
    catch (err) {
      console.log(err);
    }
  }

  handleCreateBallot = async e => {
    e.preventDefault();

    try {
      const response = await updateBallot(this.state.ballot);
      this.props.history.push(`/ballot/${response.id}`);
    }
    catch (err) {
      console.log(err);
    }
  }

  doNothing = e => {
    e.preventDefault();
  }

  handleNameChange = e => {
    e.preventDefault();

    const currentBallot = this.state.ballot;
    currentBallot.name = e.target.value;
    this.setState({ ballot: currentBallot });
  }

  handleAdminCodeChange = e => {
    e.preventDefault();

    const currentBallot = this.state.ballot;
    currentBallot.adminCode = e.target.value;
    this.setState({ ballot: currentBallot });
  }

  handleVoteCodeChange = e => {
    e.preventDefault();

    const currentBallot = this.state.ballot;
    currentBallot.voteCode = e.target.value;
    this.setState({ ballot: currentBallot });
  }

  handleVoteCodeCheck = e => {
    // toggle the state
    this.setState({ enableVoteCodeInput: !this.state.enableVoteCodeInput });

    // if it just got turned off, change the ballot's "voteCode" to null
    if (!this.state.enableVoteCodeInput) {
      const currentBallot = this.state.ballot;
      currentBallot.voteCode = null;
      this.setState({ ballot: currentBallot });
    } 

  }

  render() {

    return (
      <div className="SetupPage">
        <h3 className="page-title">setup ballot</h3>
        <form className="page">

          <span className="panel-title">setup</span>
          <fieldset className="panel">
            <label>
              <span>Ballot Name:</span>
              <input onChange={this.handleNameChange} name="name" required={true}/>
            </label>
            <label>
              <span>Admin Code:</span>
              <input onChange={this.handleAdminCodeChange} name="adminCode"/>
            </label>
          </fieldset>

          <span className="panel-title">permissions (optional)</span>
          <fieldset className="panel">
            <label>
              <span><input type="checkbox" onClick={this.handleVoteCodeCheck}/>Voting Code:</span>
              <input name="voteCode" disabled={!this.state.enableVoteCodeInput}/>
            </label>
          </fieldset>

          <span className="panel-title">add books</span>
          <fieldset className="panel">
            <BookSuggest ballotId={this.state.ballot.id}/>
          </fieldset>

          <button type="submit" onClick={this.handleCreateBallot}>create ballot</button>
        </form>
      </div>
    );
  
  }

}