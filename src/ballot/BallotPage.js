import { Component } from 'react';
import { getBallot, getSuggestions, getUsers, getVotes, addUser, addVote, updateBallot, updateVote } from '../utils/backend-api';
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
    winners: null         // this is how we know if the vote is over. The winners will be an array (in case there are ties)
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

      if (ballot.endDate) {
        this.calculateWinners();
      }
    }
    catch (err) {
      console.log(err.message);
    }
  }

  calculateWinners = () => {
    // we want cands to look like this: ['fdsa4D3', 'fd5HH3a', 'fdsa4af']
    const cands = this.state.suggestions.map(suggestion => suggestion.gbooks);
    // we want votes to be an array or arrays, each inner array representing a single vote
    // .split(' ') turns 'fdsa4D3 fd5HH3a fdsa4af' into ['fdsa4D3', 'fd5HH3a', 'fdsa4af']
    const votes = this.state.votes.map(vote => vote.vote.split(' '));

    this.setState({ winners: parseWinner(rankedChoiceVote(cands, votes)) });
  }

  onEndVote = async () => {
    // when the admin hits "end vote", we set the state's "winners" property 

    //send put request to update endDate of ballot
    const ballot = this.state.ballot;
    ballot.endDate = Date.now().toString();
    const response = await updateBallot(ballot);
    console.log(ballot);

    this.setState({ ballot: response });

    this.calculateWinners();
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
      vote: voteOrder.join(' ') // ['fdsa5RR', 'F43sf4a', 'HJ54mLi'] ==> 'fdsa5RR F43sf4a HJ54mLi'
    };

    let response;
    if (this.state.hasUserVoted) {
      const match = this.state.votes.find(vote => vote.userId === this.state.currentUser.id); // goes through the array and for each vote finds first matching userId
      match.vote = voteOrder.join(' ');
      response = await updateVote(match);
      this.setState({ votes: (await getVotes((this.state.ballot.id))) });
    }
    else {
      response = await addVote(vote);
      // add the vote to state 
      this.setState({ votes: [...this.state.votes, response], hasUserVoted: true });
    }

  };

  signIn = user => {
    this.setState({ currentUser: user });

    // check if the user has already voted
    if (this.state.votes.some(vote => vote.userId === user.id)) this.setState({ hasUserVoted: true });
  }

  signUp = async user => {
    // user object is passed in with "username" and "password" already set

    // set the ballot_id for the user
    user.ballotId = this.state.ballot.id;

    // add the user to our sql table
    const response = await addUser(user);
    this.setState({ users: [...this.state.users, response] });
    
    // add the user to our state
    this.signIn(response);
  }

  signOut = () => {
    this.setState({ currentUser: null, hasUserVoted: false });
  }

  render() {

    return (
      <div className="BallotPage page">

        <h3 className="page-title">ballot: {this.state.ballot.name}</h3>
        <span className="url-instructions">share this ballot with your group: <input className="read-only" value={window.location.href} readOnly={true} /></span>

        {!Boolean(this.state.ballot.endDate) && <><span className="panel-title">login</span>
          <LoginPanel currentUser={this.state.currentUser} users={this.state.users} showAdmin={this.state.showAdmin} onAdminInput={this.onAdminInput} onSignUp={this.signUp} onSignIn={this.signIn} onSignOut={this.signOut} /></>}

        {this.state.showAdmin && <>
          <span className="panel-title">admin</span>
          <AdminPanel onEndVote={this.onEndVote} winners={this.state.winners} />
        </>}

        {!Boolean(this.state.winners)
          ? <>
            {this.state.isDataLoaded && <>
              <span className="panel-title">vote <span>({this.state.votes.length} votes so far)</span></span>
              <VotingPanel suggestions={this.state.suggestionsFull} onVote={this.submitVote} currentUser={this.state.currentUser} votes={this.state.votes} winners={this.state.winners} hasUserVoted={this.state.hasUserVoted} />
            </>}
          </>
          : <>
            <span className="panel-title">results</span>
            <div className="panel"><div>The winner is...</div>
              {this.state.winners.map(winner => { // winner is a google books id
                const book = getByProperty(this.state.suggestionsFull, winner, 'googleId');
                // full google books data (title, author, etc)
                return <li className="search-result" key={book.googleId}>
                  <img src={book.image ? book.image : '/assets/nocover.jpeg'} alt={book.title} />
                  <div>
                    <p>{book.title}{book.subtitle && <span>: {book.subtitle}</span>}</p>
                    <p className="book-author">{book.authors[0]}</p>
                    {book.price && <p>${book.price}</p>}
                  </div>
                </li>;
              })}
            </div>
          </>
        }
      </div>
    );
  }
}