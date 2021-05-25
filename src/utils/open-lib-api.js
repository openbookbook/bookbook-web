import request from 'superagent';

const GBOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(query, printType = 'books') {
  const response = await request
    .get(GBOOKS_API) 
    .query({ q: query, printType: printType });
  
  if (response.status === 400) {
    throw response.body;
  }

  return response.body.items.map(mungeBook);
};

export async function createBallot(ballot = { adminCode: 'default', name: 'default', voteCode: null }) {
  const response = await request
    .post('/api/ballots')
    .send(ballot);

  if (response.status === 400) {
    throw response.body;
  }

  return response.body;

};

export async function updateBallot(ballot) {
  const response = await request 
    .put(`/api/ballots/${ballot.id}`)
    .send(ballot);

  if (response.status === 400) {
    throw response.body;
  }

  return response.body;

}

// export async function addSuggestion(suggestion) {
//   const response = await request 
//     .post('/api/suggestions')

// }






function mungeBook(book) {
  return {
    title: book.volumeInfo.title,
    subtitle: book.volumeInfo.subtitle,
    description: book.volumeInfo.description,
    authors: book.volumeInfo.authors || [],
    googleId: book.id,
    pageCount: book.volumeInfo.pageCount,
    image: (book.volumeInfo.imageLinks) ? book.volumeInfo.imageLinks.thumbnail : null,
    price: (book.saleInfo.retailPrice) ? book.saleInfo.retailPrice.amount : null
  };
}

