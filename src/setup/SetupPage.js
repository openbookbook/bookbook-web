import { Component } from 'react';
import { createBallot, updateBallot } from '../utils/backend-api';
import BookSuggest from './BookSuggest';
import './SetupPage.css';

export default class SetupPage extends Component {

  state = {
    ballot: {},
    enableVoteCodeInput: false,
    bookCount: 0,
    errorMessage: null
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
      if (this.state.ballot.name === 'default') this.setState({ errorMessage: 'please enter a name!' });
      else if (this.state.ballot.adminCode === 'default') this.setState({ errorMessage: 'please enter an admin code!' });
      else if (this.state.bookCount < 2) this.setState({ errorMessage: 'please add at least 2 books!' });
      else {
        const response = await updateBallot(this.state.ballot);
        this.props.history.push(`/ballot/${response.id}`);
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  
  handleBookCountChange = num => {
    this.setState({ bookCount: num });
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
              <span title="the name of the ballot">ballot name:</span>
              <input onChange={this.handleNameChange} name="name" required={true}/>
            </label>
            <label>
              <span title="don't lose this! you need this in order to get the results of an election">admin code:</span>
              <input onChange={this.handleAdminCodeChange} name="adminCode" required={true}/>
            </label>
          </fieldset>

          <span className="panel-title">permissions <span>(optional)</span></span>
          <fieldset className="panel PermissionsPanel">
            <label>
              <span title="requires users to know the voting code in order to submit a vote"><input type="checkbox" onClick={this.handleVoteCodeCheck}/>voting code:</span>
              <input type="text" name="voteCode" disabled={!this.state.enableVoteCodeInput}/>
            </label>
          </fieldset>

          <span className="panel-title">add books {Boolean(this.state.bookCount) && <span>({this.state.bookCount} books added)</span>}</span>
          <fieldset className="panel">
            <BookSuggest ballotId={this.state.ballot.id} onBookCountChange={this.handleBookCountChange}/>
          </fieldset>

          <span>{this.state.errorMessage}</span>
          <button type="submit" onClick={this.handleCreateBallot}>create ballot</button>
        </form>
      </div>
    );
  
  }

}