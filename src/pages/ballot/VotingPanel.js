import React, { useState } from 'react';
import './VotingPanel.css';

/** @typedef {import('../../utils/backend-api').Candidate} Candidate */
/** @typedef {ReturnType<typeof import('../../state/useBallot')['default']>} UseBallotReturn */

const SHOW_BOX_VIEW = false;

/**
 * @param {{
 *   authorName: string;
 *   candidates: UseBallotReturn['candidates'];
 *   currentRanking: UseBallotReturn['currentRanking'];
 *   handleRankingChange: UseBallotReturn['handleRankingChange'];
 *   handleSaveBallot: UseBallotReturn['handleSaveBallot'];
 *   votes: UseBallotReturn['votes'];
 * }} props
 */
const VotingPanel = props => {
  const { authorName, candidates, currentRanking, handleRankingChange, handleSaveBallot } = props;

  const handleMoveUp = ({ target }) => {
    console.log(target.name);
    const oldIndex = Number(currentRanking.map(c => c.id).indexOf(`${Number(target.name)}`));
    const newIndex = Math.max(oldIndex - 1, 0);

    handleRankingChange(oldIndex, newIndex);
  };

  const handleMoveDown = ({ target }) => {
    const oldIndex = Number(currentRanking.map(c => c.id).indexOf(`${Number(target.name)}`));
    const newIndex = Math.min(oldIndex + 1, currentRanking.length - 1);

    handleRankingChange(oldIndex, newIndex);
  };

  const onRankingChange = ({ target }) => {
    target.value = Math.max(target.min, target.value);
    target.value = Math.min(target.max, target.value);

    const oldIndex = Number(currentRanking.map(c => c.id).indexOf(`${Number(target.name)}`));
    const newIndex = Number(target.value) - 1;

    handleRankingChange(oldIndex, newIndex);
  };

  return <div className="VotingPanel panel">
    <p>
      this ballot uses <span title="rcv is a voting system in which voters rank candidates by preference">ranked choice voting</span> to vote. please put the books in the order that you most desire to read them.
    </p>

    {/* TODO: abstract this to work for non-books */}
    <ul className={SHOW_BOX_VIEW ? 'box-view' : 'list-view'}>
      {currentRanking.map(candidate => (
        <li className="book-candidate" key={candidate.id}>
          <div className="steps">
            <button className="step-up" name={candidate.id} onClick={handleMoveUp}>▲</button>
            <input
              type="number"
              className="preference-input"
              min="1"
              max={candidates.length}
              name={candidate.id}
              value={currentRanking.map(c => c.id).indexOf(candidate.id) + 1}
              onChange={onRankingChange}
            />
            <button className="step-down" name={candidate.id} onClick={handleMoveDown}>▼</button>
          </div>
          {candidate?.info
            ? <>
              <img src={candidate.info?.image ? candidate.info.image : '/assets/nocover.jpeg'} alt={candidate.info?.title}/>
              <div>
                <p>{candidate.info?.title}{candidate.info?.subtitle && <span>: {candidate.info?.subtitle}</span>}</p>
                <p className="book-author">{candidate.info?.authors?.join(', ')}</p>
              </div>
            </>
            : <span>{candidate.id}</span>
          }
        </li>
      ))}
    </ul>

    <button
      className="primary"
      disabled={!authorName}
      onClick={handleSaveBallot}
    >
      {authorName ? 'submit' : 'edit'} your vote {!authorName && '(please sign in)'}
    </button>
  </div>;
};

const MemoizedVotingPanel = React.memo(VotingPanel);

export default MemoizedVotingPanel;
