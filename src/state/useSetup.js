import { useState } from 'react';
import { useHistory } from 'react-router';
import {
  addBallot as postBallot,
  addSuggestion as postSuggestion
} from '../utils/backend-api';
import { base62 } from '../utils/utils';

/** @typedef {import('../utils/backend-api').CreateCandidateDto} CreateCandidateDto */

/** @typedef {Omit<CreateCandidateDto, 'electionId'> & { info: import('../utils/gbooks-api').Book }} SelectedBook */
  const [errorMessage, setErrorMessage] = useState('');
  const [ballotName, setBallotName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [voteCode, setVoteCode] = useState(null);
  const [votingMethod, setVotingMethod] = useState('default');
  const [candidateType, setCandidateType] = useState('book');
  const [suggestions, setSuggestions] = useState([]);

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
      // check the three conditions before sending the PUT request to make the actual ballot
      if (!ballotName) setErrorMessage('please enter a ballot name!');
      else if (!adminCode) setErrorMessage('please enter an admin code!');
      else if (suggestions.length < 2) setErrorMessage('please add at least 2 books!');
      else {
        // first post the ballot, then post all the suggestions, and then redirect
        const resp = await postBallot({
          name: ballotName, 
          votingMethod,
          candidateType,
          adminCode,
          voteCode
        });

        await Promise.all(suggestions.map(suggestion => postSuggestion({
          ballotId: resp.id,
          userId: null,
          suggestion: suggestion.suggestion || suggestion.gbooks || suggestion.description,
          ...suggestion
        }))).then(() => history.push(`/ballot/${base62.encode(Number(resp.id))}`));
      }
    } catch (err) { console.error(err); }
  };

  return {
    errorMessage,
    createBallot,
    setBallotName,
    setAdminCode,
    setVoteCode,
    setVotingMethod,
    setCandidateType,
    suggestions,
    addSuggestion,
    deleteSuggestion
  };
};

export default useSetup;
