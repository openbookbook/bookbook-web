import { Component } from 'react';
import { addSuggestion, deleteSuggestion } from '../utils/backend-api.js';
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
    this.setState({ added: [...currentAdded, bookResponse] });

    // update the count 
    this.props.onBookCountChange(this.state.added.length);
  }

  handleDeleteSuggestion = async e => {
    e.preventDefault();

    // update the server
    await deleteSuggestion(e.target.value);

    // update the state
    const newAdded = this.state.added.filter(book => book.id.toString() !== e.target.value.toString());
    this.setState({ added: newAdded });
  }

  handleSearch = async e => {
    e.preventDefault();

    try {
      const query = e.target.value.trim();

      // only gets results if something has been searched
      let results = this.state.results;
      if (query) results = await searchBooks(query);
      else results = [];

      // set state
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
          candidate books:
          {this.state.added.map(book => {
            return (
              <li className="search-result" key={book.gbooks}>
                <button value={book.id} onClick={this.handleDeleteSuggestion}>-</button>
                <img src={book.result.image ? book.result.image : '/assets/nocover.jpeg'} alt={book.result.title}/>
                <div>
                  <p>{book.result.title}{book.result.subtitle && <span>: {book.result.subtitle}</span>}</p>
                  <p className="book-author">{book.result.authors[0]}</p>
                </div>
              </li>
            );
          })}
        </ul>}

        <input type="text" onChange={this.handleSearch} placeholder="search for books"/>
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