import React from 'react';
import './ResultsPanel.css';

const ResultsPanel = props => {
  const { winners, ballot, candidates } = props;

  return (
    <div className="ResultsPanel panel">
      <p>the winner is...</p>
      {winners.map(winnerId => {
        if (!ballot.candidateType || ballot.candidateType === 'book') {
          const book = candidates.find(c => c.id === Number(winnerId));

          return (
            <li key={winnerId}>
              <img src={book?.info?.image || '/assets/nocover.jpeg'} alt={book?.info?.title}/>
              <div>
                <p>{book?.info?.title}{book?.info?.subtitle && <span>: {book.info.subtitle}</span>}</p>
                <p className="book-author">{book?.info?.authors?.join(', ')}</p>
                {book?.info?.price && <p>${book.info.price}</p>}
              </div>
            </li>
          );
        } else {
          return <li key={winnerId}>{winnerId}</li>;
        }
      })}

      {/* <p>Based off {votes.length} votes.</p>
      <ul>
        {votes.map(vote => <li>{vote}</li>)}
      </ul> */}
    </div>
  );
};

const MemoizedResultsPanel = React.memo(ResultsPanel);

export default ResultsPanel;
export { MemoizedResultsPanel };
