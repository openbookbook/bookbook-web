import React, { useCallback, useState } from 'react';

/** @typedef {import('../../utils/backend-api').Vote} Vote */

/**
 * @param {{ votes: Vote[]; }} props
 */
const LoginPanel = props => {
  const { votes, } = props;

  const [inputtedUsername, setInputtedUsername] = useState('');

  const handleNameChange = useCallback(
    /** @type {React.ChangeEventHandler<HTMLInputElement>} */
    (e => {
      e.preventDefault();
      e.target.value = e.target.value.trim();
      setInputtedUsername(e.target.value);
    }),
    []
  );

  const voteCount = votes.filter(vote => vote.author === inputtedUsername).length;

  return (
    <form className="LoginPanel panel">
      <input type="text" placeholder="name" defaultValue={inputtedUsername} onChange={handleNameChange}/>
      {!voteCount ? `${inputtedUsername} has not yet voted` : `you have voted for ${voteCount} candidates`}
    </form>
  );
};

const MemoizedLoginPanel = React.memo(LoginPanel);

export default MemoizedLoginPanel;
