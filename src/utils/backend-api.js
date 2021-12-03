import request from 'superagent';

const URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8001' 
  : 'https://openbookbook.herokuapp.com'
;

const postReq = async (path, data) => {
  const resp = await request
    .post(`${URL}/${path}`)
    .send(data)
  ;

  if (resp.status >= 400) throw resp.body;

  return resp.body;
};

const getReq = async (path) => {
  const resp = await request.get(`${URL}/${path}`);

  if (resp.status >= 400) throw resp.body;

  return resp.body;
};

const putReq = async (path, data) => {
  const resp = await request
    .put(`${URL}/${path}`)
    .send(data)
  ;

  if (resp.status >= 400) throw resp.body;

  return resp.body;
};

const deleteReq = async (path) => {
  const resp = await request.delete(`${URL}/${path}`);

  if (resp.status >= 400) throw resp.body;

  return resp.body;
};

const addBallot = async (ballot) => postReq('api/ballots', ballot);
const getBallot = async (ballotId) => getReq(`api/ballots/${ballotId}`);
const updateBallot = async (ballot) => putReq(`api/ballots/${ballot.id}`, ballot);

const addSuggestion = async (suggestion) => postReq('api/suggestions', suggestion);
const getSuggestions = async (ballotId) => getReq(`api/suggestions?ballot=${ballotId}`);
const deleteSuggestion = async (id) => deleteReq(`api/suggestions/${id}`);

const addUser = async (user) => postReq('api/users', user);
const loginUser = async (user) => postReq(`api/users/${user.id}/login`, user);
const updateUser = async (user) => putReq(`api/users/${user.id}`, user);
const getUsers = async (ballotId) => getReq(`api/users?ballot=${ballotId}`);

export {
  addBallot,
  updateBallot,
  addSuggestion,
  getSuggestions,
  deleteSuggestion,
  getBallot,
  addUser,
  loginUser,
  updateUser,
  getUsers
};
