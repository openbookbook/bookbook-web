
/** @typedef {{ id: `${number}`; createdAt: string; deletedAt?: string | null; updatedAt: string; __typename: string; }} Model - fields shared by all models */

// Elections
/** @typedef {Model & { isCompleted: boolean; name: string; __typename: 'Election'; candidates?: Array<Candidate>; votes?: Array<Vote>; }} Election */
/** @typedef {Pick<Election, 'name'>} CreateElectionDto */
/** @typedef {Pick<Election, 'id' | 'isCompleted' | 'name'>} UpdateElectionDto */

// Candidates
/** @typedef {Model & { author?: string; electionId: string; googleBooksId?: string; kind: string; title: string; __typename: 'Candidate'; votes: Array<Vote>; }} Candidate */
/** @typedef {Pick<Candidate, 'author' | 'electionId' | 'googleBooksId' | 'kind' | 'title'>} CreateCandidateDto */

// Votes
/** @typedef {Model & { author: string; candidateId: string; electionId: string; score: number; __typename: 'Vote'; }} Vote */
/** @typedef {Pick<Vote, 'author' | 'candidateId' | 'electionId' | 'score'>} UpsertVoteDto */

const URL = process.env.API_URL;
;

/** @type {HeadersInit} */
const HEADERS = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

/**
 * @param {'get' | 'post' | 'put' | 'patch' | 'delete'} method
 * @param {string} path
 * @template Dto @param {Dto} [data]
 */
const req = async (method, path, data) => {
  try {
    const response = await fetch(
      `${URL}/${path}`,
      {
        method: method.toUpperCase(),
        headers: HEADERS,
        ...(data ? { body: JSON.stringify(data) } : {}),
      },
    );

    return await response.json();
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
};
/** @template T; @template {Partial<T>} Dto; @param {string} path; @param {Dto} data; @returns {Promise<T>} */
const postReq = async (path, data) => await req('post', path, data);
/** @param {string} path; @template T @returns {Promise<T>} */
const getReq = async (path) => await req('get', path);
/** @param {string} path; @template T @param {T} data */
const putReq = async (path, data) => await req('put', path, data);
/** @param {string} path; @template T @param {T} data */
const patchReq = async (path, data) => await req('patch', path, data);
/** @param {string} path; @template {Model} T @returns {Promise<Pick<T, 'id' | '__typename'>>} */
const deleteReq = async (path) => await req('delete', path);

/* elections */
/** @param {CreateElectionDto} ballot; @returns {ReturnType<typeof postReq<Election, CreateElectionDto>>} */
const addBallot = async (ballot) => postReq('elections', ballot);
/** @param {string | number} ballotId; @returns {ReturnType<typeof getReq<Election>>} */
const getBallot = async (ballotId) => getReq(`elections/${ballotId}`);
/** @param {UpdateElectionDto} ballot */
const updateBallot = async (ballot) => putReq(`elections/${ballot.id}`, ballot);
/** @param {Pick<UpdateElectionDto, 'id' | 'isCompleted'>} ballot */ // TODO
const completeBallot = async (ballot) => patchReq(`elections/${ballot.id}`, ballot);

/* candidates */
/** @param {CreateCandidateDto} candidate */
const addCandidate = async (candidate) => postReq('candidates', candidate);
/** @param {string} electionId; @returns {ReturnType<typeof getReq<Candidate[]>>} */
const getCandidatesForElection = async (electionId) => getReq(`candidates?electionId=${electionId}`);
/** @param {string} id */
const deleteCandidate = async (id) => deleteReq(`candidates/${id}`);

/* votes */
/** @param {UpsertVoteDto} vote */
const upsertVote = async (vote) => postReq('votes', vote);

export {
  addBallot,
  addCandidate,
  deleteCandidate,
  getBallot,
  getCandidatesForElection,
  updateBallot,
  completeBallot,
  upsertVote,
};
