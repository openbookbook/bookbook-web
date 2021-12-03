import request from 'superagent';

const URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8001' 
  : 'https://openbookbook.herokuapp.com'
;

const req = async (method, path, data) => {
  const resp = data 
    ? await request[method](`${URL}/${path}`).send(data)
    : await request[method](`${URL}/${path}`)
  ;

  if (resp.status >= 400) throw resp.body;

  return resp.body;
};
const postReq = async (path, data) => await req('post', path, data);
const getReq = async (path) => await req('get', path);
const putReq = async (path, data) => await req('put', path, data);
const patchReq = async (path, data) => await req('patch', path, data);
const deleteReq = async (path) => await req('delete', path);

/* ballots */
const addBallot = async (ballot) => postReq('api/ballots', ballot);
const getBallot = async (ballotId) => getReq(`api/ballots/${ballotId}`);
const updateBallot = async (ballot) => putReq(`api/ballots/${ballot.id}`, ballot);

/* suggestions */
const addSuggestion = async (suggestion) => postReq('api/suggestions', suggestion);
const getSuggestions = async (ballotId) => getReq(`api/suggestions?ballot=${ballotId}`);
const deleteSuggestion = async (id) => deleteReq(`api/suggestions/${id}`);

/* users */
const addUser = async (user) => postReq('api/users', user);
const loginUser = async (user) => postReq(`api/users/${user.id}/login`, user);
const updateUser = async (user) => putReq(`api/users/${user.id}`, user);
const patchUser = async (user, patch) => patchReq(`api/users/${user.id}`, patch);
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
  patchUser,
  getUsers
};
