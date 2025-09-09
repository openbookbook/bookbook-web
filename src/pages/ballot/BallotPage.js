import React, { useCallback } from 'react';
import useBallot from '../../state/useBallot';
import VotingPanel from './VotingPanel';
import AdminPanel from './AdminPanel';
import ResultsPanel from './ResultsPanel';
import './BallotPage.css';

/** @typedef {{ match: import('react-router-dom').RouteComponentProps['match'] }} BallotPageProps */

/** @param {BallotPageProps} props */
const BallotPage = props => {
  const {
    candidates,
    currentRanking,
    election,
    endVote,
    handleRankingChange,
    handleSaveBallot,
    loading,
    setUsername,
    username,
    votes,
    winners,
  } = useBallot(props.match.params.id);

  const handleNameChange = useCallback(
    /** @type {React.ChangeEventHandler<HTMLInputElement>} */
    (e => {
      e.preventDefault();
      e.target.value = e.target.value.trim();
      setUsername(e.target.value);
    }),
    []
  );

  const voteCount = votes.filter(vote => vote.author === username).length;
  const voterCount = votes.map(vote => vote.author).filter((v, i, a) => a.indexOf(v) === i).length;

  return (loading || !election)
    ? <span>loading...</span>
    : (
      <div className="BallotPage page">
        <h3 className="page-title">{election?.name} ballot</h3>
        <span className="url-instructions"><input className="read-only" value={window.location.href} readOnly={true} /></span>

        {!Boolean(election?.isCompleted) && <>
          <span className="panel-title">Enter your name!</span>
          <form className="LoginPanel panel">
            <input type="text" placeholder="name" defaultValue={username} onChange={handleNameChange}/>
            {username && (
              <span>{!voteCount ? `${username} has not yet voted` : `you have voted for ${voteCount} candidates`}</span>
            )}
          </form>
        </>}

        {Boolean(election?.isCompleted)
          ? (
            <>
              <span className="panel-title">see the results!</span>
              <ResultsPanel
                candidates={candidates}
                election={election}
                winners={winners}
              />
            </>
          ) : (
            <>
              <span className="panel-title">vote! <span>({voterCount} voters so far)</span></span>
              <VotingPanel
                authorName={username}
                candidates={candidates}
                currentRanking={currentRanking}
                handleRankingChange={handleRankingChange}
                handleSaveBallot={handleSaveBallot}
                votes={votes}
              />
            </>
          )
        }

        <>
          <span className="panel-title">Ready to end the election?</span>
          <AdminPanel election={election} onEndVote={endVote} />
        </>
      </div>
    );
};

const MemoizedBallotPage = React.memo(BallotPage);

export default BallotPage;
export { MemoizedBallotPage };
