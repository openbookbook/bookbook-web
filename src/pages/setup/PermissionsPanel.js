import React from 'react';

const PermissionsPanel = props => {
  const {
    setVoteCode,
    enableVoteCodeInput,
    setEnableVoteCodeInput
  } = props;
  const handleTextChange = e => setVoteCode(e.target.value);

  return (
    <fieldset className="panel PermissionsPanel">
      <label>
        <span title="requires users to know the voting code in order to submit a vote">
          <input
            type="checkbox"
            onClick={e => {
              setEnableVoteCodeInput(!enableVoteCodeInput);
              if (!e.target.checked) setVoteCode(null);
            }}
          />
          voting code:
        </span>
        <input
          type="text"
          onChange={handleTextChange}
          name="voteCode"
          disabled={!enableVoteCodeInput}
          placeholder="secret code"
        />
      </label>
    </fieldset>
  );
};

const MemoizedPermissionsPanel = React.memo(PermissionsPanel);

export default PermissionsPanel;
export { MemoizedPermissionsPanel };
