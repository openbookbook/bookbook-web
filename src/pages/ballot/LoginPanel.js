import React, { useState } from 'react';
import ToggleText from '../../components/ToggleText';

const LoginPanel = props => {
  const { 
    users, currentUser, 
    signIn, signOut, signUp, 
    showAdminPanel, onAdminInput
  } = props;

  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showAdminCodeInput, setShowAdminCodeInput] = useState(false);
  const [newUsername, setNewUsername] = useState(true);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [inputtedUsername, setInputtedUsername] = useState('');
  const [inputtedPassword, setInputtedPassword] = useState('');

  const handleNameChange = e => {
    e.preventDefault();
    e.target.value = e.target.value.trim();
    setInputtedUsername(e.target.value);

    // reset password error
    setShowPasswordError(false);

    // check for matching username
    const match = users.find(u => u.username === e.target.value);
    setNewUsername(match ? false : true);
    setPasswordRequired(match?.password ? true : false);
  };

  const handlePasswordChange = e => {
    e.preventDefault();
    setInputtedPassword(e.target.value.trim());
    setShowPasswordError(false);
  };

  const handleSignOn = async e => {
    e.preventDefault();
    const resp = await (newUsername ? signUp : signIn)({
      username: inputtedUsername,
      password: inputtedPassword
    });
    
    if (!resp) setShowPasswordError(true);
    else {
      setInputtedUsername('');
      setInputtedPassword('');
      setShowPasswordError(false);
      setNewUsername(true);
      setPasswordRequired(false);
    }
  };

  const handleSignOut = e => {
    e.preventDefault();
    signOut();
    setInputtedUsername('');
    setInputtedPassword('');
    setShowPasswordError(false);
    setNewUsername(true);
    setPasswordRequired(false);
  };

  return <form className="LoginPanel panel">
    {currentUser
      ? <>
        <span>Hello, {currentUser.username}</span>
        <button className="primary" onClick={handleSignOut}>Sign Out</button>
      </>
      : <>
        <input type="text" placeholder="name" defaultValue={inputtedUsername} onChange={handleNameChange}/>
        {(passwordRequired || newUsername) && <input 
          defaultValue={inputtedPassword}
          type="password"
          placeholder={`password (${passwordRequired ? 'required' : 'optional'})`}
          onChange={handlePasswordChange}
        />}
        <button className="primary" onClick={handleSignOn}>Sign {newUsername ? 'Up' : 'In'}</button>
      </>
    }

    {showPasswordError && <p>Incorrect password.</p>}

    {!showAdminPanel && <>
      <p className="admin-option">
        <span>{showAdminCodeInput ? 'Not an a' : 'A'}dmin? </span>
        <ToggleText
          onClick={() => setShowAdminCodeInput(!showAdminCodeInput)}
        >Click here!</ToggleText>
      </p>
      {showAdminCodeInput && <input type="text" placeholder="admin code" onChange={onAdminInput}/>}
    </>}
  </form>;
};

const MemoizedLoginPanel = React.memo(LoginPanel);

export default LoginPanel;
export { MemoizedLoginPanel };
