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
    ballot: {},           // from our API route: get('/api/ballots/:id)
    votes: [],            // from our API route: get('/api/:ballotid/votes)
    users: [],            // from our API route: get('/api/:ballotid/users)
    suggestions: [],      // from our API route: get('/api/:ballotid/suggestions)
    suggestionsFull: [],  // from google books API

    hasUserVoted: false,  // this will tell us whether this user has already voted or not
    showAdmin: false,     // this is whether or not we're displaying the admin panel
    currentUser: null,    // this is how we know if a user is logged in or not
    isDataLoaded: false,  // this is to make sure the other components don't load until our awaits have completed
    winners: null         // this is how we know if the vote is over
  }

  async componentDidMount() {
    try {
      // make API calls to get: (1) the ballot, (2) the suggestions for that ballot, (3) the votes for that ballot, (4) the users for that ballot
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

      const users = await getUsers(ballot.id);
      this.setState({ users: users, isDataLoaded: true });
    }
    catch (err) {
      console.log(err.message);
    }
  }

  onEndVote = async () => {
    // when the admin hits "end vote", we set the state's "winners" property 
    const cands = this.state.suggestions.map(suggestion => suggestion.gbooks);
    const votes = this.state.votes.map(vote => vote.vote.split(' '));

    this.setState({ winners: parseWinner(rankedChoiceVote(cands, votes)) });
  }

  onAdminInput = e => {
    e.preventDefault();

    // if the inputted admin code is correct, set showAdmin to true
    if (e.target.value === this.state.ballot.adminCode) this.setState({ showAdmin: true });
  }

  submitVote = async voteOrder => {
    // input: ["gbooksid1", "gbooksid2", etc]
    const vote = {
      userId: this.state.currentUser.id,
      ballotId: this.state.ballot.id,
      vote: voteOrder.join(' ')
    };

    const response = await addVote(vote);
    
    // add the vote to state 
    this.setState({ votes: [...this.state.votes, response], hasUserVoted: true });
  };
  
  signIn = user => {
    this.setState({ currentUser: user });

    // check if the user has already voted
    if (this.state.votes.filter(vote => vote.userId === user.id).length) this.setState({ hasUserVoted: true });
  }

  signUp = async user => {
    // set the ballot_id for the user
    user.ballotId = this.state.ballot.id;

    // add the user to our sql table
    const response = await addUser(user);

    // add the user to our state
    this.signIn(response);
  }
  
  render() {
    
    return (
      <div className="BallotPage page">

        <h3 className="page-title">ballot: {this.state.ballot.name}</h3> 
        <span className="url-instructions">share this ballot with your group: <input className="read-only" value={window.location.href} readOnly={true} /></span>

        <span className="panel-title">login</span>
        <LoginPanel currentUser={this.state.currentUser} users={this.state.users} showAdmin={this.state.showAdmin} onAdminInput={this.onAdminInput} onSignUp={this.signUp} onSignIn={this.signIn}/>
        
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