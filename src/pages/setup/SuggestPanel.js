import React, { useState } from 'react';
import useGoogleBooks from '../../state/useGoogleBooks';
import './SuggestPanel.css';

/** @typedef {ReturnType<typeof import('../../state/useSetup').useSetup>} UseSetupReturn */

/**
 * @param {{
 *   addSuggestion: UseSetupReturn['addSuggestion'];
 *   deleteSuggestion: UseSetupReturn['deleteSuggestion'];
 *   suggestions: UseSetupReturn['suggestions'];
 * }} props
 */
const SuggestPanel = props => {
  const {
    suggestions,
    addSuggestion,
    deleteSuggestion
  } = props;

  const {
    results,
    handleSearch
  } = useGoogleBooks();

  const [showBoxView, setShowBoxView] = useState(false);

  /** @param {import('../../utils/gbooks-api').Book} info */
  const handleAddSuggestion = info => {
    addSuggestion({
      googleBooksId: info.googleId,
      kind: 'book',
      title: info.title,
      info
    });
  };

  return (
    <fieldset className="SuggestPanel panel">
      {Boolean(suggestions.length) && <>
        <div className="panel">
          <div>
            <span>candidate books: </span>
            <input
              id="switch-checkbox"
              className="switch-checkbox"
              onClick={() => setShowBoxView(!showBoxView)}
              type="checkbox"
            />
            <label className="switch" htmlFor="switch-checkbox">
              <div></div>
            </label>
          </div>
          <ul className={'book-display ' + (showBoxView ? 'box-view' : 'list-view')}>
            {suggestions.map(book => (
              <li key={book.googleBooksId}>
                <button onClick={() => deleteSuggestion(book.googleBooksId, 'gbooks')}>-</button>
                <img src={book.info?.image ? book.info.image : '/assets/nocover.jpeg'} alt={book.info.title}/>
                <div>
                  <p>{book.title}{book.info.subtitle && <span>: {book.info.subtitle}</span>}</p>
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
        onChange={handleSearch}
      />

      <ul className="book-display list-view">
        {(results || []).filter(
          book => !suggestions.some(suggestion => suggestion.googleBooksId === book.googleId)
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
