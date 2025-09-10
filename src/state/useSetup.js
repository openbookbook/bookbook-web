import { useState } from 'react';
import { useHistory } from 'react-router';
import {
  addBallot as postBallot,
  addCandidate
} from '../utils/backend-api';
import { base62 } from '../utils/utils';

/** @typedef {import('../utils/backend-api').CreateCandidateDto} CreateCandidateDto */

/** @typedef {Omit<CreateCandidateDto, 'electionId'> & { info: import('../utils/gbooks-api').Book }} SelectedBook */

export const useSetup = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [ballotName, setBallotName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [voteCode, setVoteCode] = useState(/** @type {null | string} */(null));
  const [votingMethod, setVotingMethod] = useState('default');
  const [candidateType, setCandidateType] = useState('book');
  const [suggestions, setSuggestions] = useState(/** @type {SelectedBook[]} */([]));

  const history = useHistory();

  /** @param {SelectedBook} suggestion */
  const addSuggestion = (suggestion, _type = 'book') =>
    setSuggestions([...suggestions, suggestion])
  ;

  const deleteSuggestion = (val, key = 'gbooks') =>
    setSuggestions(suggestions.filter(s => s[key] !== val));
  ;

  const createBallot = async () => {
    console.log(ballotName, adminCode, voteCode, suggestions);
    try {
      if (!ballotName) setErrorMessage('please enter a ballot name!');
      else if (suggestions.length < 2) setErrorMessage('please add at least 2 books!');
      else {
        const resp = await postBallot({ name: ballotName });

        await Promise.all(
          suggestions.map(suggestion => addCandidate({
            election: { id:resp.id },
            ...suggestion
          }))
        ).then(() => history.push(`/ballot/${base62.encode(Number(resp.id))}`));
      }
    } catch (err) { console.error(err); }
  };

  return {
    addSuggestion,
    createBallot,
    deleteSuggestion,
    errorMessage,
    setAdminCode,
    setBallotName,
    setCandidateType,
    setVoteCode,
    setVotingMethod,
    suggestions,
  };
};

export default useSetup;
