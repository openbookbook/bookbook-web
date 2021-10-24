import { useState } from 'react';
import SuggestPanel from './SuggestPanel';
import SetupPanel from './SetupPanel';
import PermissionsPanel from './PermissionsPanel';
import useSetup from './useSetup';
import './SetupPage.css';

const SetupPage = () => {
  const {
    errorMessage,
    suggestions,
    setBallotName,
    setAdminCode,
    setVoteCode,
    createBallot,
    addSuggestion,
    deleteSuggestion
  } = useSetup();

  const [enableVoteCodeInput, setEnableVoteCodeInput] = useState(false);
  
  return (
    <div className="SetupPage">
      <h3 className="page-title">ballot setup</h3>
      <form className="page">

        <span className="panel-title">setup</span>
        <SetupPanel
          setAdminCode={setAdminCode}
          setBallotName={setBallotName}
        />

        {false && <>
          <span className="panel-title">permissions <span>(optional)</span></span>
          <PermissionsPanel
            setVoteCode={setVoteCode}
            enableVoteCodeInput={enableVoteCodeInput}
            setEnableVoteCodeInput={setEnableVoteCodeInput}
          />
        </>}

        <span className="panel-title">
          add books{Boolean(suggestions.length) && <span>({suggestions.length} books added)</span>}:
        </span>
        <SuggestPanel
          suggestions={suggestions}
          addSuggestion={addSuggestion}
          deleteSuggestion={deleteSuggestion}
        />

        <span>{errorMessage}</span>
        <button 
          className="primary" 
          type="submit"
          onClick={e => {
            e.preventDefault();
            createBallot();
          }}
        >create ballot</button>
      </form>
    </div>
  );
};

export default SetupPage;
