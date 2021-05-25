import request from 'superagent';

const URL = 'https://quiet-reaches-96525.herokuapp.com';

export async function createBallot(ballot = { adminCode: 'default', name: 'default', voteCode: null }) {
  const response = await request
    .post(URL + '/api/ballots')
    .send(ballot);

  if (response.status === 400) {
    throw response.body;
  }

  return response.body;

};

export async function updateBallot(ballot) {
  const response = await request 
    .put(URL + `/api/ballots/${ballot.id}`)
    .send(ballot);

  if (response.status === 400) {
    throw response.body;
  }

  return response.body;

}

export async function addSuggestion(suggestion) {
  const response = await request 
    .post(URL + '/api/suggestions')
    .send(suggestion);

  if (response.status === 400) {
    throw response.body;
  }

  return response.body;

}

export async function getBallot(ballotid) {
  const response = await request
    .get(`/api/ballots/${ballotid}`);

  if (response.status === 400) {
    throw response.body;
  }

  return response.body;
    
}

export async function getSuggestions(ballotid) {
  const response = await request 
    .get(`/api/${ballotid}/suggestions`);

  if (response.status === 400) {
    throw response.body;
  }

  return response.body;
  
}

export async function getVotes(ballotid) {
  const response = await request 
    .get(`/api/${ballotid}/votes`);

  if (response.status === 400) {
    throw response.body;
  }

  return response.body;

}

export async function addVote(vote) {
  const response = await request 
    .post(`/api/votes`)
    .send(vote);

  if (response.status === 400) {
    throw response.body;
  }

  return response.body;

}

export async function addUser(user) {
  const response = await request 
    .post('/api/users')
    .send(user);

  if (response.status === 400) {
    throw response.body;
  }

  return response.body;

}

