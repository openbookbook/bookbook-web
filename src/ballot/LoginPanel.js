import React from 'react';
import { Component } from 'react';

export default class LoginPanel extends Component {

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