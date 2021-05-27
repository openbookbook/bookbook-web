import { Component } from 'react';
import { getBallot, getSuggestions, getUsers, getVotes, addUser, addVote } from '../utils/backend-api';
import { getBook } from '../utils/gbooks-api';
import { getByProperty } from '../utils/utils.js';
import { rankedChoiceVote, parseWinner } from '../utils/voting-methods.js';
import './BallotPage.css';
import LoginPanel from './LoginPanel';
import VotingPanel from './VotingPanel';
import AdminPanel from './AdminPanel';

export default class BallotPage extends Component {

  state = {
    showAdmin: false,
    ballot: {},
    suggestions: [],
    votes: [], 
    users: [],
    currentUser: null,
    isDataLoaded: false,
    winners: null
  }

  async componentDidMount() {
    try {
      const ballot = await getBallot(this.props.match.params.id);
      this.setState({ ballot: ballot });

      const suggestions = await getSuggestions(ballot.id);
      const suggestionsFull = [];
      for (let suggestion of suggestions) {
        const book = await getBook(suggestion.gbooks);
        suggestionsFull.push(book);
      }
      this.setState({ suggestions: suggestions, suggestionsFull: suggestionsFull });

      const votes = await getVotes(ballot.id);
      this.setState({ votes: votes });
      console.log(votes);

      const users = await getUsers(ballot.id);
      this.setState({ users: users, isDataLoaded: true });
    }
    catch (err) {
      console.log(err.message);
    }
  }

  onEndVote = async () => {
    const cands = this.state.suggestions.map(suggestion => suggestion.gbooks);
    const votes = this.state.votes.map(vote => vote.vote.split(' '));

    this.setState({ winners: parseWinner(rankedChoiceVote(cands, votes)) });
  }

  onAdminInput = e => {
    e.preventDefault();

    const input = e.target.value;
    if (input === this.state.ballot.adminCode) {
      this.setState({ showAdmin: true });
    }

  }

  submitVote = async voteOrder => {
    // input: ["gbooksid1", "gbooksid2", etc]
    const vote = {
      userId: this.state.currentUser.id,
      ballotId: this.state.ballot.id,
      vote: voteOrder.join(' ')
    };

    await addVote(vote);
    console.log(vote);
  };
  
  signIn = user => {
    
    this.setState({ currentUser: user });
    console.log(user);
  }

  signUp = async user => {
    user.ballotId = this.state.ballot.id;
    const response = await addUser(user);
    console.log(response);
    this.setState({ currentUser: response });
  }
  
  render() {
    console.log(this.props.match.url);
    return (
      <div className="BallotPage page">
        <h3 className="page-title">ballot: {this.state.ballot.name}</h3> 
        <span className="url-instructions">share this ballot with your group: https://bookbookbook.netlify.app{this.props.match.url}</span>
        <span className="panel-title">login</span>
        <LoginPanel currentUser={this.state.currentUser} users={this.state.users} onAdminInput={this.onAdminInput} onSignUp={this.signUp} onSignIn={this.signIn} />
        {this.state.showAdmin && <>
          <span className="panel-title">admin</span>
          <AdminPanel onEndVote={this.onEndVote} winners={this.state.winners}/>
        </>}
        {!Boolean(this.state.winners)
          ? <>
            {this.state.isDataLoaded && <>
              <span className="panel-title">vote <span>({this.state.votes.length} votes so far)</span></span>
              <VotingPanel suggestions={this.state.suggestionsFull} onVote={this.submitVote} currentUser={this.state.currentUser} winners={this.state.winners}/>
            </>}
          </>
          : <>
            <span className="panel-title">results</span>
            <div className="panel">
              {this.state.winners.map(winner => {
                const book = getByProperty(this.state.suggestionsFull, winner, 'googleId');
                return <>{book.title}</>;
              })}
            </div>
          </>
        }
      </div>
    );
  }
}