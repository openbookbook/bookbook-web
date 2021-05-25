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
        <input type="text" onChange={this.handleSearch}/>
        {/*<button>🔎</button>*/}
        <ul>
          {this.state.results.map(book => <li key={book.googleId}>{book.title}: {book.subtitle} by {book.authors[0]}</li>)}
        </ul>
      </div>
    );
  }

}