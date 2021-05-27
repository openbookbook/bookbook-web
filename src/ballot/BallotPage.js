import { Component } from 'react';
import { getBallot, getSuggestions, getUsers, getVotes, addUser, addVote } from '../utils/backend-api';
import { getBook } from '../utils/gbooks-api';
import { getByProperty, relocateItemInArray } from '../utils/utils.js';
import { rankedChoiceVote, parseWinner } from '../utils/voting-methods.js';
import './BallotPage.css';

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
        {/*only load adminpanel if showadmin is true, showadmin is true on if the code is entered*/}
        {this.state.showAdmin && <>
          <span className="panel-title">admin</span>
          <AdminPanel onEndVote={this.onEndVote} winners={this.state.winners}/>
        </>}
      </div>
    );
  }
}

class LoginPanel extends Component {

  state = {
    inputtedName: '',
    inputtedPassword: '',
    showing: false,
    error: false,
  }

  handleAdminInput = e => {
    this.props.onAdminInput(e);
  }

  handleNameChange = e => {
    e.preventDefault();

    const inputtedName = e.target.value;

    this.setState({ inputtedName: inputtedName });
  } 
  
  handlePasswordInput = e => {
    e.preventDefault();

    const inputtedPassword = e.target.value;

    this.setState({ inputtedPassword: inputtedPassword });
  } 

  handleAdminSwitch = (e) => {
    e.preventDefault();

    this.setState({ showing: !this.state.showing });
  }

  handleSignIn = e => {
    e.preventDefault();

    //loop through users that we passed down as props, see if the user exists, if not create new user, if it does exist check if password is correct

    let match = null;

    this.props.users.forEach(user => {
      if (user.username === this.state.inputtedName) {
        match = user;
      };
    });
    console.log(this.props.users);
    if (!match) { 
      const user = {
        username: this.state.inputtedName,
        password: this.state.inputtedPassword,
      };

      this.props.onSignUp(user);

    } else {
      if (match.password) {
        if (match.password === this.state.inputtedPassword) this.props.onSignIn(match); 
        else if (this.state.inputtedPassword !== match.password) {
          this.setState({ error: true });
        }
      } 
      else {
        this.props.onSignIn(match); 
      }
    }
  }


  render() {
    const showing = this.state.showing;
    return (
      <div className="LoginPanel panel">
        <form>
          {!this.props.currentUser && <input placeholder="name" onChange={this.handleNameChange}/>}
          {!this.props.currentUser && <input placeholder="password (optional)" onChange={this.handlePasswordInput}/>}
          {!this.props.currentUser && <button onClick={this.handleSignIn}>Sign In</button>}
          {this.state.error === true && <div>Incorrect password.</div>}
          <p className="admin-option"><span>Admin? </span><span className="admin-click" onClick={this.handleAdminSwitch}>Click here!</span></p>
          { showing
            ? <input placeholder="admin code" onChange={this.handleAdminInput} />
            : null
          }

        </form>
      </div>
    );

  }

}

class VotingPanel extends Component {

  state = {
    suggestions: [],
    voteOrder: null,
  }

  async componentDidMount() {
    try {
      // fetch all the data for each suggestion and save that
      this.setState({ suggestions: this.props.suggestions });
      
      // create a voteOrder array
      this.setState({ voteOrder: this.props.suggestions.map(book => book.googleId) });
    }
    catch (err) {
      console.log(err);
    }
  }

  handleOrderChange = e => {
    // get the old and new index
    let oldIndex = Number(this.state.voteOrder.indexOf(e.target.name));
    let newIndex = Number(e.target.value - 1);

    // figure out new order
    const newOrder = relocateItemInArray(this.state.voteOrder, oldIndex, newIndex);
    this.setState({ voteOrder: newOrder });

    console.log(this.state.voteOrder);
  }

  handleVoteClick = e => {
    e.preventDefault();
    
    this.props.onVote(this.state.voteOrder);
    e.target.disabled = true;
  }

  render() {

    console.log('Signed in as: ', this.props.currentUser);

    return (
      <div className="VotingPanel panel">
        <p>This ballot uses ranked choice voting to vote. Please put the books in the order that you most desire to read them.</p>
        <ul>
          {Boolean(this.state.voteOrder) && this.state.suggestions.map(book => (
            <li className="book-candidate" key={book.googleId}>
              <input name={book.googleId} onChange={this.handleOrderChange} type="number" min="1" max={this.state.suggestions.length} value={this.state.voteOrder.indexOf(book.googleId) + 1}/>
              <img src={book.image ? book.image : '/assets/nocover.jpeg'} alt={book.title} />
              <div>
                <p>{book.title}{book.subtitle && <span>: {book.subtitle}</span>}</p>
                <p className="book-author">{book.authors[0]}</p>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={this.handleVoteClick} disabled={!Boolean(this.props.currentUser)}>submit your vote{!Boolean(this.props.currentUser) && ' (please sign in)'}</button>
      </div>
    );
  }

}

class AdminPanel extends Component {

  render() {
    return (
      <div className="AdminPanel panel">
        hello, admin!
        <button onClick={this.props.onEndVote} disabled={Boolean(this.props.winners)}>End vote!</button>
      </div>
    );
  }

}