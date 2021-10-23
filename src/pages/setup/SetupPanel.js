import React from 'react';

const SetupPanel = props => {
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
            console.log(e.target.value);
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
            console.log(e.target.value);
            setAdminCode(e.target.value);
          }}
          name="adminCode" 
          required={true}
        />
      </label>
    </fieldset>
  );
};

export default SetupPanel;
