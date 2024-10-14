import request from 'superagent';

const GBOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

/** @returns {Promise<Book[]>} */
async function searchBooks(query, printType = 'books') {
  const response = await request
    .get(GBOOKS_API)
    .query({ q: query, printType: printType });

  if (response.status >= 400) throw response.body;

  return response.body.items.map(mungeBook);
};

async function getBook(gbooks) {
  const response = await request.get(`${GBOOKS_API}/${gbooks}`);

  if (response.status === 400) throw response.body;

  return mungeBook(response.body);
}

/**
 * @typedef {{
 *   authors: string[];
 *   description: string;
 *   googleId: string;
 *   image: string;
 *   pageCount: number;
 *   price: number | undefined;
 *   subtitle: string;
 *   title: string;
 * }} Book
 *
 * @param {Object} book
 * @returns {Book}
 */
function mungeBook(book) {
  return {
    authors: book.volumeInfo.authors || [],
    description: book.volumeInfo.description,
    googleId: book.id,
    image: book?.volumeInfo?.imageLinks?.thumbnail,
    pageCount: book.volumeInfo.pageCount,
    price: book?.saleInfo?.listPrice?.amount,
    subtitle: book.volumeInfo.subtitle,
    title: book.volumeInfo.title,
  };
}

export { getBook, searchBooks };
