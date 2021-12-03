import React, { useState } from 'react';
import useGoogleBooks from '../../state/useGoogleBooks';
import './SuggestPanel.css';

const SuggestPanel = props => {
  const {
    results,
    handleSearch
  } = useGoogleBooks();

  const [showBoxView, setShowBoxView] = useState(false);

  const {
    suggestions,
    addSuggestion,
    deleteSuggestion
  } = props;

  const handleAddSuggestion = info => {
    const suggestion = {
      gbooks: info.googleId,
      type: 'book',
      info
    };

    addSuggestion(suggestion);
  };

  return (
    <fieldset className="SuggestPanel panel">
      {Boolean(suggestions.length) && <>
        <div className="panel">
          <div>
            <span>candidate books: </span>
            <input onClick={() => setShowBoxView(!showBoxView)} className="switch-checkbox" id="switch-checkbox" type="checkbox"/>
            <label className="switch" htmlFor="switch-checkbox">
              <div></div>
            </label>
          </div>
          <ul className={'book-display ' + (showBoxView ? 'box-view' : 'list-view')}>
            {suggestions.map(book => (
              <li key={book.gbooks}>
                <button onClick={() => deleteSuggestion(book.gbooks, 'gbooks')}>-</button>
                <img src={book.info?.image ? book.info.image : '/assets/nocover.jpeg'} alt={book.info.title}/>
                <div>
                  <p>{book.info.title}{book.info.subtitle && <span>: {book.info.subtitle}</span>}</p>
                  <p className="book-author">{book.info?.authors?.join(', ')}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>}

      <input 
        type="search" 
        placeholder="search for books"
        onChange={e => handleSearch(e.target.value)}
      />

      <ul className="book-display list-view">
        {results.filter(
          book => !suggestions.some(suggestion => suggestion.gbooks === book.googleId)
        ).map(book => (
          <li className="search-result" key={book.googleId}>
            <button
              value={book.googleId}
              onClick={e => {
                e.preventDefault();
                handleAddSuggestion(book);
              }}
            >+</button>
            <figure>
              <img src={book.image || '/assets/nocover.jpeg'} alt={book.title}/>
            </figure>
            <div>
              <p>{book.title}{book.subtitle && <span>: {book.subtitle}</span>}</p>
              <p className="book-author">{book.authors.join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};

const MemoizedSuggestPanel = React.memo(SuggestPanel);

export default SuggestPanel;
export { MemoizedSuggestPanel };
