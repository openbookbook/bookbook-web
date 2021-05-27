import { Component } from 'react';
import { addSuggestion, deleteSuggestion } from '../utils/backend-api.js';
import { searchBooks } from '../utils/gbooks-api.js';
import './BookSuggest.css';

export default class BookSuggest extends Component {

  state = {
    search: '',   // user inputted query
    results: [],  // results from google books api
    added: []     // list of results the user added 
  }

  handleAddSuggestion = async e => {
    e.preventDefault();

    // get the result from our results list in the state (which we got from google books)
    const result = this.state.results.filter(result => result.googleId === e.target.value)[0];

    // construct the book that we're gonna POST to our backend
    const book = {
      ballotId: this.props.ballotId,  // passed down from SetupPage
      gbooks: e.target.value,         // gotten from google books search api
      userId: null                    // default to null since it's added by admin
    };

    // add the book to the server
    const bookResponse = await addSuggestion(book);

    // add the book to the state
    const currentAdded = this.state.added;
    // add google books response data to our book to access full info (title, author, etc)
    bookResponse.info = result;
    this.setState({ added: [...currentAdded, bookResponse] });

    // update the state to remove the book from the search results
    this.setState({ results: this.state.results.filter(book => book.googleId !== e.target.value) });

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
    
    // update the count 
    this.props.onBookCountChange(this.state.added.length);
  }

  handleSearch = async e => {
    e.preventDefault();

    try {
      // trim whitespace before/after the inputted search query
      const query = e.target.value.trim();

      // only gets results if something has been searched, otherwise set results to empty array
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
                <img src={book.info.image ? book.info.image : '/assets/nocover.jpeg'} alt={book.info.title}/>
                <div>
                  <p>{book.info.title}{book.info.subtitle && <span>: {book.info.subtitle}</span>}</p>
                  <p className="book-author">{book.info.authors[0]}</p>
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