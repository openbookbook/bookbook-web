import { useCallback, useState } from 'react';
import { searchBooks } from '../utils/gbooks-api';

/** @typedef {import('../utils/gbooks-api').Book} Book */

const useGoogleBooks = () => {
  /** @type {ReturnType<typeof useState<Book[]>>} */
  const [results, setResults] = useState();

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleSearch = useCallback(
    async e => {
      let query = e.target.value;

      try {
        query = query.trim();
        setResults(query ? await searchBooks(query) : []);
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  return { results, handleSearch, };
};

export default useGoogleBooks;
