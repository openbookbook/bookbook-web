import { Component } from 'react';
import { getBallot, getSuggestions, getUsers, getVotes, addUser } from '../utils/backend-api';
import { getBook } from '../utils/gbooks-api';
import { relocateItemInArray } from '../utils/utils.js';
import './BallotPage.css';

export default class BallotPage extends Component {

  state = {
    showAdmin: false,
    ballot: {},
    suggestions: [],
    votes: [], 
    users: [],
    currentUser: null,
    isDataLoaded: false
  }

  async componentDidMount() {
    try {
      const ballot = await getBallot(this.props.match.params.id);
      this.setState({ ballot: ballot });

      this.setState({ suggestions: await getSuggestions(ballot.id) });

      const votes = await getVotes(ballot.id);
      this.setState({ votes: votes });

      const users = await getUsers(ballot.id);
      this.setState({ users: users, isDataLoaded: true });
    }
    catch (err) {
      console.log(err.message);
    }
  }

  onAdminInput = e => {
    e.preventDefault();

    const input = e.target.value;
    if (input === this.state.ballot.adminCode) {
      this.setState({ showAdmin: true });
    }

  }

  //if (user already exist) {
  // check for password
  // if (password match){
  //    sign user in
  //} 
  // else {
  // (create user)
//}

// if (user exist) {
//   if (pass exist && pass match) {
//       sign user in
//   }
// } else {
  

  signUp = async user => {
    const userList = await getUsers(this.state.ballot.id)
    if (userList.filter(existingUser => user.username === existingUser.username).length > 0) {
      if (pass exist && pass match) {
          sign user in
      }
    } else {
      user.ballotId = this.state.ballot.id;
      const response = await addUser(user);
      console.log(response);
      this.setState({ currentUser: response });
    }
  } 

  render() {
    return (
      <div className="BallotPage page">
        <h3 className="page-title">ballot: {this.state.ballot.name}</h3>
        <span className="panel-title">1. login</span>
        <LoginPanel currentUser={this.state.currentUser} users={this.state.users} onAdminInput={this.onAdminInput} onSignUp={this.signUp} />
        {this.state.isDataLoaded && <>
          <span className="panel-title">2. vote</span>
          <VotingPanel suggestions={this.state.suggestions}/>
        </>}
        {/*only load adminpanel if showadmin is true, showadmin is true on if the code is entered*/}
        {this.state.showAdmin && <>
          <span className="panel-title">3. admin</span>
          <AdminPanel/>
        </>}
      </div>
    );
  }

}

class LoginPanel extends Component {

  state = {
    inputtedName: '',
    inputtedPassword: '',
    showing: false
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
    };

  }

  render() {
    const showing = this.state.showing;
    return (
      <div className="LoginPanel panel">
        <form>
          {!this.props.currentUser && <input placeholder="name" onChange={this.handleNameChange}/>}
          {!this.props.currentUser && <input placeholder="password (optional)" onChange={this.handlePasswordInput}/>}
          {!this.props.currentUser && <button onClick={this.handleSignIn}>Sign In</button>}
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
    voteOrder: null
  }

  async componentDidMount() {
    try {
      // fetch all the data for each suggestion and save that
      const gSuggestions = [];
      
      for (let suggestion of this.props.suggestions) {
        const book = await getBook(suggestion.gbooks);
        gSuggestions.push(book);
      }
      this.setState({ suggestions: [...gSuggestions] });
      
      // create a voteOrder array
      this.setState({ voteOrder: gSuggestions.map(book => book.googleId) });
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
  }

  render() {

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
      </div>
    );
  }

}

class AdminPanel extends Component {

  render() {
    return (
      <div className="AdminPanel panel">
        hello, admin!
        <button>End vote!</button>
      </div>
    );
  }

}