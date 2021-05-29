import { Component } from 'react';
import { createBallot, updateBallot } from '../utils/backend-api';
import BookSuggest from './BookSuggest';
import './SetupPage.css';

export default class SetupPage extends Component {

  state = {
    ballot: {},                   // the current ballot being constructed (starts with default values and then does a put request to update)
    enableVoteCodeInput: false,   // show or hide vote code input
    bookCount: 0,                 // display how many books have been added and check for at least 2 when create ballot is clicked
    errorMessage: null            // either "requires name", "requires admin code" or "need at least 2 books"
  }

  async componentDidMount() {
    try {
      // on load, create a default ballot so we have a ballot id to work with for the suggestions
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
      const { ballot, bookCount } = this.state;

      // check the three conditions before sending the PUT request to make the actual ballot
      if (ballot.name === '__default__' || !Boolean(ballot.name)) this.setState({ errorMessage: 'please enter a name!' });
      else if (ballot.adminCode === '__default__' || !Boolean(ballot.adminCode)) this.setState({ errorMessage: 'please enter an admin code!' });
      else if (bookCount < 2) this.setState({ errorMessage: 'please add at least 2 books!' });
      else {
        const response = await updateBallot(ballot);
        this.props.history.push(`/ballot/${response.id}`); // redirect to ballot page
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  
  handleBookCountChange = num => {
    this.setState({ bookCount: num }); // comes from the BookSuggest component to update the bookCount in SetupPage's state
  }

  handleNameChange = e => {
    e.preventDefault();
    e.target.value = e.target.value.trim();

    // update the "name" property of the ballot in our state
    const currentBallot = this.state.ballot;
    currentBallot.name = e.target.value;
    this.setState({ ballot: currentBallot });
  }

  handleAdminCodeChange = e => {
    e.preventDefault();
    e.target.value = e.target.value.trim();

    // update the "adminCode" property of the ballot in our state
    const currentBallot = this.state.ballot;
    currentBallot.adminCode = e.target.value;
    this.setState({ ballot: currentBallot });
  }

  handleVoteCodeChange = e => {
    e.preventDefault();
    e.target.value = e.target.value.trim();

    // update the "voteCode" property of the ballot in our state
    const currentBallot = this.state.ballot;
    currentBallot.voteCode = e.target.value;
    this.setState({ ballot: currentBallot });
  }

  handleVoteCodeCheck = e => {
    // toggle the enableVoteCodeInput in state
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

          {false && <>
            <span className="panel-title">permissions <span>(optional)</span></span>
            <fieldset className="panel PermissionsPanel">
              <label>
                <span title="requires users to know the voting code in order to submit a vote"><input type="checkbox" onClick={this.handleVoteCodeCheck}/>voting code:</span>
                <input onChange={this.handleVoteCodeChange} type="text" name="voteCode" disabled={!this.state.enableVoteCodeInput}/>
              </label>
            </fieldset>
          </>}

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