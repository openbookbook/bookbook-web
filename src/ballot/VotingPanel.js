import React, { Component } from 'react';
import { relocateItemInArray, shuffleArray } from '../utils/utils.js';
import './VotingPanel.css';

export default class VotingPanel extends Component {

  state = {
    suggestions: [],    // list of candidate books (full google books api results, not sql results)
  }

  async componentDidMount() {
    try {
      // fetch all the data for each suggestion and save that
      let arr = this.props.suggestions;

      // shuffle the array
      shuffleArray(arr);

      // save state
      this.setState({ suggestions: arr });
    }
    catch (err) {
      console.log(err);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentUser !== this.props.currentUser) {
      // if user has already voted, organize the suggestions in the order the user had them in
      if (this.props.hasUserVoted) {
        const voteOrder = this.props.votes.find(vote => vote.userId === this.props.currentUser.id).vote.split(' ');
        const arr = this.props.suggestions.sort((a, b) => {
          return voteOrder.indexOf(a.googleId) - voteOrder.indexOf(b.googleId);
        });
        this.setState({ suggestions: arr });
      }
    }
  }

  handleOrderChange = ({ target }) => {
    // get the old and new index
    let oldIndex = Number(this.state.suggestions.map(b => b.googleId).indexOf(target.name));
    let newIndex = Number(target.value - 1);

    // figure out new order
    this.setState({ suggestions: relocateItemInArray(this.state.suggestions, oldIndex, newIndex) });
  }

  handleVoteClick = e => {
    e.preventDefault();

    this.props.onVote(this.state.suggestions.map(b => b.googleId));
  }

  onStepUp = e => {
    e.preventDefault();
    const input = document.querySelector(`.steps > input[name="${e.target.value}"]`);
    input.value = Math.max(Number(input.value) - 1, Number(input.min));
    this.handleOrderChange({ target: input });
  }

  onStepDown = e => {
    e.preventDefault();
    const input = document.querySelector(`.steps > input[name="${e.target.value}"]`);
    input.value = Math.min(Number(input.value) + 1, Number(input.max));
    this.handleOrderChange({ target: input });
  }

  render() {

    return (
      <div className="VotingPanel panel">
        <p>
          <input className="switch-checkbox" id="switch-checkbox" type="checkbox"/>
          <label className="switch" for="switch-checkbox">
            <div></div>
          </label>
          This ballot uses <span title="RCV is a voting system in which voters rank candidates by preference">ranked choice voting</span> to vote. Please put the books in the order that you most desire to read them.
        </p>

        <ul>
          {Boolean(this.state.suggestions) && this.state.suggestions.map(book => (
            <li className="book-candidate" key={book.googleId}>
              <div className="steps">
                <button onClick={this.onStepUp} value={book.googleId} className="step-up">▲</button>
                <input className="preference-input" name={book.googleId} onChange={this.handleOrderChange} type="number" min="1" max={this.state.suggestions.length} value={this.state.suggestions.map(b => b.googleId).indexOf(book.googleId) + 1} />
                <button onClick={this.onStepDown} value={book.googleId} className="step-down">▼</button>
              </div>
              <img src={book.image ? book.image : '/assets/nocover.jpeg'} alt={book.title} />
              <div>
                <p>{book.title}{book.subtitle && <span>: {book.subtitle}</span>}</p>
                <p className="book-author">{book.authors[0]}</p>
              </div>
            </li>
          ))}
        </ul>

        <button onClick={this.handleVoteClick} disabled={!Boolean(this.props.currentUser)}>
          {Boolean(this.props.hasUserVoted)
            ? 'edit your vote'
            : 'submit your vote' + (!Boolean(this.props.currentUser) ? ' (please sign in)' : '')}
        </button>
      </div>
    );
  }

}