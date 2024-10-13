import { useState } from 'react';
import { searchBooks } from '../utils/gbooks-api';

const useGoogleBooks = () => {
  const [results, setResults] = useState([]);

  const handleSearch = async query => {
    try {
      query = query.trim();

      setResults(query ? await searchBooks(query) : []);

    } catch (err) { console.error(err); }
  };

  return { results, handleSearch, };
};

export default useGoogleBooks;
