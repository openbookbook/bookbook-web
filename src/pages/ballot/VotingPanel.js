import React, { useState } from 'react';
import './VotingPanel.css';

const VotingPanel = props => {
  const { candidates, currentUser, currentRanking, updateVote, handleRankingChange } = props;
  // const { ballot } = props;

  const [showBoxView] = useState(false);

  const handleMoveUp = ({ target }) => {
    console.log(target.name);
    const oldIndex = Number(currentRanking.map(c => c.id).indexOf(Number(target.name)));
    const newIndex = Math.max(oldIndex - 1, 0);

    handleRankingChange(oldIndex, newIndex);
  };

  const handleMoveDown = ({ target }) => {
    const oldIndex = Number(currentRanking.map(c => c.id).indexOf(Number(target.name)));
    const newIndex = Math.min(oldIndex + 1, currentRanking.length - 1);

    handleRankingChange(oldIndex, newIndex);
  };

  const onRankingChange = ({ target }) => {
    target.value = Math.max(target.min, target.value);
    target.value = Math.min(target.max, target.value);

    const oldIndex = Number(currentRanking.map(c => c.id).indexOf(Number(target.name)));
    const newIndex = Number(target.value) - 1;

    handleRankingChange(oldIndex, newIndex);
  };

  return <div className="VotingPanel panel">
    {/* TODO: make this bit dynamic based on ballot.votingMethod */}
    <p>
      This ballot uses <span title="RCV is a voting system in which voters rank candidates by preference">ranked choice voting</span> to vote. Please put the books in the order that you most desire to read them.
    </p>

    {/* TODO: abstract this to work for non-books */}
    <ul className={showBoxView ? 'box-view' : 'list-view'}>
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
      disabled={!Boolean(currentUser)}
      onClick={updateVote}
    >
      {Boolean(currentUser?.vote) ? 'edit' : 'submit'} your vote {!Boolean(currentUser) && '(please sign in)'}
    </button>
  </div>;
};

const MemoizedVotingPanel = React.memo(VotingPanel);

export default VotingPanel;
export { MemoizedVotingPanel };
