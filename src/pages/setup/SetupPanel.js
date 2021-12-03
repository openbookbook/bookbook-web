import React, { useState } from 'react';
import ToggleText from '../../components/ToggleText';

const SetupPanel = props => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    setBallotName,
    setAdminCode
  } = props;

  return (
    <fieldset className="panel SetupPanel">
      <label>
        <span title="the name of the ballot">ballot name:</span>
        <input 
          type="text" 
          onChange={e => {
            e.preventDefault();
            setBallotName(e.target.value);
          }}
          name="name"
          required={true}
        />
      </label>
      <label>
        <span title="don't lose this! you need this in order to get the results of an election">admin code:</span>
        <input 
          type="text" 
          onChange={e => {
            e.preventDefault();
            setAdminCode(e.target.value);
          }}
          name="adminCode" 
          required={true}
        />
      </label>
      {showAdvanced 
        ? <>
          <label>
            <span>voting method:</span>
            <select defaultValue="rcv">
              <option value="rcv">ranked choice vote</option>
              <option value="fptp" disabled>first past the post</option>
              <option value="approval" disabled>approval</option>
            </select>
          </label>
          {/* <label>
            <span>candidate type:</span>
            <select defaultValue="book">
              <option value="book">book</option>
              <option value="other">other</option>
            </select>
          </label> */}
        </>
        : <ToggleText onClick={() => setShowAdvanced(true)}>Show advanced options</ToggleText>
      }
    </fieldset>
  );
};

const MemoizedSetupPanel = React.memo(SetupPanel);

export default SetupPanel;
export { MemoizedSetupPanel };
