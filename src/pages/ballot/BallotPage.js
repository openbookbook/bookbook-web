import { useState } from 'react';
import useBallot from '../../state/useBallot';
import LoginPanel from './LoginPanel';
import VotingPanel from './VotingPanel';
import AdminPanel from './AdminPanel';
import ResultsPanel from './ResultsPanel';
import './BallotPage.css';

/*
TODO:
 - [x] login panel
 - [ ] admin panel
 - [x] voting panel
 - [x] result panel
*/

const BallotPage = props => {
  const { 
    loading, ballot, 
    users, signIn, signUp, signOut, currentUser,
    candidates, winners, endVote,
    currentRanking, updateVote, handleRankingChange
  } = useBallot(props.match.params.id);

  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleAdminInput = e => {
    e.preventDefault();

    // if the inputted admin code is correct, set showAdminPanel to true
    if (e.target.value === ballot?.adminCode) setShowAdminPanel(true);
  };

  return loading ? <span>loading...</span> : <div className="BallotPage page">
    <h3 className="page-title">{ballot?.name} ballot</h3>
    <span className="url-instructions"><input className="read-only" value={window.location.href} readOnly={true} /></span>

    {!Boolean(ballot?.endDate) && <>
      <span className="panel-title">login</span>
      <LoginPanel
        showAdminPanel={showAdminPanel}
        onAdminInput={handleAdminInput}
        signUp={signUp}
        signIn={signIn}
        signOut={signOut}
        users={users}
        currentUser={currentUser}
      />
    </>}

    {showAdminPanel && <>
      <span className="panel-title">admin</span>
      <AdminPanel
        ballot={ballot}
        onEndVote={endVote}
      />
    </>}

    {Boolean(ballot?.endDate) 
      ? <>
        <span className="panel-title">results</span>
        <ResultsPanel
          winners={winners}
          ballot={ballot}
          candidates={candidates}
          users={users}
        />
      </>
      : <>
        <span className="panel-title">vote <span>({users.filter(u => u.vote).length} votes so far)</span></span>
        <VotingPanel
          ballot={ballot}
          candidates={candidates}
          currentUser={currentUser}
          currentRanking={currentRanking}
          updateVote={updateVote}
          handleRankingChange={handleRankingChange}
        />
      </>
    }

  </div>;
};

export default BallotPage;
