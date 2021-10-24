import request from 'superagent';

const GBOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(query, printType = 'books') {
  const response = await request
    .get(GBOOKS_API) 
    .query({ q: query, printType: printType });
  
  if (response.status >= 400) throw response.body;

  return response.body.items.map(mungeBook);
};

export async function getBook(gbooks) {
  const response = await request.get(`${GBOOKS_API}/${gbooks}`);
  
  if (response.status === 400) throw response.body;

  return mungeBook(response.body);
}

function mungeBook(book) {
  return {
    title: book.volumeInfo.title,
    subtitle: book.volumeInfo.subtitle,
    description: book.volumeInfo.description,
    authors: book.volumeInfo.authors || [],
    googleId: book.id,
    pageCount: book.volumeInfo.pageCount,
    image: book?.volumeInfo?.imageLinks?.thumbnail,
    price: book?.saleInfo?.listPrice?.amount
  };
}