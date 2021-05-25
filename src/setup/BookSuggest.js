import { Component } from 'react';
import { addSuggestion } from '../utils/backend-api.js';
import { searchBooks } from '../utils/gbooks-api.js';
import './BookSuggest.css';

export default class BookSuggest extends Component {

  state = {
    search: '',
    results: [],
    added: []
  }

  handleAddSuggestion = async e => {
    e.preventDefault();

    // get the result
    const result = this.state.results.filter(result => result.googleId === e.target.value)[0];

    // construct the book
    const book = {
      ballotId: this.props.ballotId, // passed down from SetupPage
      gbooks: e.target.value, // gotten from google books search api
      userId: null
    };

    // add the book to the server
    const bookResponse = await addSuggestion(book);

    // add the book to the state
    const currentAdded = this.state.added;
    bookResponse.result = result;
    console.log(bookResponse);
    this.setState({ added: [...currentAdded, bookResponse] });
  }

  handleSearch = async e => {
    e.preventDefault();

    try {
      const query = e.target.value.trim();

      let results = this.state.results;
      //only gets results if something has been searched
      if (query) results = await searchBooks(query);

      this.setState({ search: query, results: results });

    }
    catch (err) {
      console.log(err);
    }

  }

  render() {
    return (
      <div className="BookSuggest">
        {Boolean(this.state.added.length) && <ul className="book-display panel">
          Candidate Books:
          {this.state.added.map(book => {
            return (
              <li className="search-result" key={book.googleId}>
                <button value={book.gbooks}>-</button>
                <img src={book.result.image ? book.result.image : '/assets/nocover.jpeg'} alt={book.result.title}/>
                <div>
                  <p>{book.result.title}{book.result.subtitle && <span>: {book.result.subtitle}</span>}</p>
                  <p className="book-author">{book.result.authors[0]}</p>
                </div>
              </li>
              /*<li className="added-book" key={book.gbooks}>
                <button>-</button>
                <span>{book.result.title}{book.result.subtitle && <span>: {book.result.subtitle}</span>}</span>
                <span className="book-author">&nbsp;{book.result.authors[0]}</span>
              </li>*/
            );
          })}
        </ul>}
        <input type="text" onChange={this.handleSearch} />
        {/*<button>🔎</button>*/}
        <ul>
          {this.state.results.map(book => {
            return (
              <li className="search-result" key={book.googleId}>
                <button value={book.googleId} onClick={this.handleAddSuggestion}>+</button>
                <img src={book.image ? book.image : '/assets/nocover.jpeg'} alt={book.title} />
                <div>
                  <p>{book.title}{book.subtitle && <span>: {book.subtitle}</span>}</p>
                  <p className="book-author">{book.authors[0]}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

}