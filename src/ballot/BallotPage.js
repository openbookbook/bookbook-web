import { Component } from 'react';
import { getBallot, getSuggestions, getUsers, getVotes, addUser } from '../utils/backend-api';
import './BallotPage.css';

export default class BallotPage extends Component {

  state = {
    showAdmin: false,
    ballot: {},
    suggestions: [],
    votes: [], 
    users: [],
    currentUser: null,
  }

  async componentDidMount() {
    try {
      const ballot = await getBallot(this.props.match.params.id);
      this.setState({ ballot: ballot });

      const suggestions = await getSuggestions(ballot.id);
      this.setState({ suggestions: suggestions });

      const votes = await getVotes(ballot.id);
      this.setState({ votes: votes });

      const users = await getUsers(ballot.id);
      this.setState({ users: users });
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

  signUp = async user => {
    user.ballotId = this.state.ballot.id;
    const response = await addUser(user);
    console.log(response);
    this.setState({ currentUser: response });
  } 

  render() {
    return (
      <div className="BallotPage page">
        <h3 className="page-title">ballot: {this.state.ballot.name}</h3>
        <span className="panel-title">1. login</span>
        <LoginPanel currentUser={this.state.currentUser} users={this.state.users} onAdminInput={this.onAdminInput} onSignUp={this.signUp} />
        <span className="panel-title">2. vote</span>
        <VotingPanel />
        {/*only load adminpanel if showadmin is true, showadmin is true on if the code is entered*/}
        {this.state.showAdmin && <>
          <span className="panel-title">3. admin</span>
          <AdminPanel />
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
      if (user.name === this.state.inputtedName) {
        match = user;
      };
    });

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

  render() {
    return (
      <div className="VotingPanel panel">
        <p>This ballot uses ranked choice voting to vote.  Please put the books in the order that you most desire to read them.</p>
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