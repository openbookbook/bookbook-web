import React from 'react';

/**
 * @typedef {{
 *   setVoteCode: React.Dispatch<React.SetStateAction<string>>;
 * }} PermissionsPanelProps
 */

/** @param {PermissionsPanelProps} props */
const PermissionsPanel = props => {
  const {
    setVoteCode,
    enableVoteCodeInput,
    setEnableVoteCodeInput
  } = props;

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
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
