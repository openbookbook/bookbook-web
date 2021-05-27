import React from 'react';
import { Component } from 'react';

export default class LoginPanel extends Component {

  state = {
    inputtedName: '',         // user input into the name input element
    inputtedPassword: '',     // user input into the password input element
    showingAdminInput: false, // whether or not the admin input is displayed
    upOrIn: 'up',             // whether we're signing up or signing in
    requiredPassword: false,  // if user exists, does the user require a password
    error: false,             // whether or not to display incorrect password message
  }

  handleNameChange = e => {
    e.preventDefault();

    // set default values
    let requiredPassword = false;
    let upOrIn = 'up';

    // check 
    const matchingUsers = this.props.users.filter(u => u.username === e.target.value);
    if (matchingUsers.length) {
      upOrIn = 'in';
      if (matchingUsers[0].password) requiredPassword = true;
    }

    // set the state
    this.setState({ inputtedName: e.target.value, upOrIn: upOrIn, requiredPassword: requiredPassword });
  } 
  
  handlePasswordInput = e => {
    e.preventDefault();
    this.setState({ inputtedPassword: e.target.value });
  } 

  handleAdminSwitch = (e) => {
    e.preventDefault();
    this.setState({ showingAdminInput: !this.state.showingAdminInput });
  }

  handleSignIn = e => {
    e.preventDefault();

    // loop through the list of existing users and try to find a match
    let match = null;
    this.props.users.forEach(user => {
      if (user.username === this.state.inputtedName) {
        match = user;
      };
    });

    // if there's no match, we're signing a user up not in
    if (!match) { 
      const user = {
        username: this.state.inputtedName,
        password: this.state.inputtedPassword,
      };

      this.props.onSignUp(user);

    } 
    else { // if there is a match we're gonna check if that match has a password set or not
      if (match.password) { // if there is a password set

        if (match.password === this.state.inputtedPassword) this.props.onSignIn(match); // if the passwords match, sign them in
        else this.setState({ error: true }); // if the passwords don't match, show the error

      } 
      else { // if there's not a password set for this existing user, just sign them in
        this.props.onSignIn(match); 
      }
    }
  }

  render() {

    const { showingAdminInput, upOrIn, requiredPassword } = this.state;

    return (
      <div className="LoginPanel">
        <form className="panel">

          {!this.props.currentUser && <>
            <input placeholder="name" onChange={this.handleNameChange}/>
            {(upOrIn === 'up' || requiredPassword) && 
              <input placeholder={`password (${requiredPassword ? 'required' : 'optional'})`} onChange={this.handlePasswordInput}/>
            }
            <button onClick={this.handleSignIn}>sign {upOrIn}</button>
          </>}

          {this.props.currentUser && <>
            <span>hello, {this.props.currentUser.username}</span>
            <button>sign out</button>
          </>}

          {this.state.error === true && <div>Incorrect password.</div>}
          
          {!this.props.showAdmin && <>
            <p className="admin-option"><span>{showingAdminInput && 'Not '}Admin? </span><span className="admin-click" onClick={this.handleAdminSwitch}>Click here!</span></p>
            { showingAdminInput
              ? <input placeholder="admin code" onChange={this.props.onAdminInput} />
              : null
            }
          </>}
        </form>
      </div>
    );

  }

}