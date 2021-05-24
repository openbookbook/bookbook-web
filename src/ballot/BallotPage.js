import { Component } from 'react';
import './BallotPage.css';

const fakeBallot = {
  id: 1,
  adminCode: '1234',
};

const fakeSuggestions = [
  {
    id: 1,
    title: 'The Fish Warrior', 
    ballotId: 1
  },
  {
    id: 2,
    title: 'Crying in H-Mart', 
    ballotId: 1
  },
  {
    id: 3,
    title: 'The Confederacy of Dunces', 
    ballotId: 1
  }
];

const fakeVotes = [
  
  {
    userName:'daniella',
    ballotId: 1,
    id: 123,
    vote: '3 1 2'
  },
  {
    userName:'austin',
    ballotId: 1,
    id: 456,
    vote: '1 3 2'
  },

];


export default class BallotPage extends Component {

  state = {
    showAdmin: false,
    ballot: fakeBallot,
    suggestions: fakeSuggestions,
    votes: fakeVotes
  } 

  onAdminInput = e => {
    e.preventDefault();

    const input = e.target.value;
    if (input === this.state.ballot.adminCode) {
      this.setState({ showAdmin: true });
    }

  }

  render() {
    return (
      <div className="BallotPage">
        <LoginPanel onAdminInput={this.onAdminInput}/>
        <VotingPanel/>
        {/*only load adminpanel if showadmin is true, showadmin is true on if the code is entered*/}
        {this.state.showAdmin && <AdminPanel/>}
      </div>
    );
  }

}

class LoginPanel extends Component {
  
  handleAdminInput = e => {
    this.props.onAdminInput(e);
  }

  render() {
   
    return (
      <div className="LoginPanel">
        <form>
          <input placeholder="name"/>
          <input placeholder="password"/>
          <input placeholder="admin code" onChange={this.handleAdminInput}/>
        </form>
      </div>
    );
  }

}

class VotingPanel extends Component {
  
  render() {
    return (
      <div className="VotingPanel">
        <p>This ballot uses ranked choice voting to vote.  Please put the books in the order that you most desire to read them.</p>
        
      </div>
    );
  }

}

class AdminPanel extends Component {
  
  render() {
    return (
      <div className="AdminPanel">
        hello, admin!
        <button>End vote!</button>
      </div>
    );
  }

}