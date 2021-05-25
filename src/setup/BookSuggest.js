import { Component } from 'react';
import { searchBooks } from '../utils/gbooks-api.js';
import './BookSuggest.css';

export default class BookSuggest extends Component {

  state = {
    search: '',
    results: []
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
        <input type="text" onChange={this.handleSearch} />
        {/*<button>🔎</button>*/}
        <ul>
          {this.state.results.map(book => {
            return < li className="search-result" key={book.googleId}>
              <img src={book.image ? book.image : '/assets/nocover.jpeg'} alt={book.title} />
              <div><p>{book.title}{book.subtitle && <span>: {book.subtitle}</span>}</p>
                <p className="book-author">{book.authors[0]}</p></div>
            </li>;
          })}
        </ul>
      </div>
    );
  }

}