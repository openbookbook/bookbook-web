import { useState } from 'react';
import { useHistory } from 'react-router';
import { 
  addBallot as postBallot, 
  addSuggestion as postSuggestion 
} from '../../utils/backend-api';
import { base62 } from '../../utils/utils';

const useSetup = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [ballotName, setBallotName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [voteCode, setVoteCode] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const history = useHistory();

  const addSuggestion = suggestion => setSuggestions([...suggestions, suggestion]);

  const createBallot = async () => {
    console.log(ballotName, adminCode, voteCode, suggestions);
    try {
      // check the three conditions before sending the PUT request to make the actual ballot
      if (!ballotName) setErrorMessage('please enter a ballot name!');
      else if (!adminCode) setErrorMessage('please enter an admin code!');
      else if (suggestions.length < 2) setErrorMessage('please add at least 2 books!');
      else {
        // first post the ballot, then post all the suggestions, and then redirect
        await postBallot({
          name: ballotName, 
          adminCode,
          voteCode
        }).then(async res => {
          await Promise.all(suggestions.map(suggestion => postSuggestion(suggestion)))
            .then(() => history.push(`/ballot/${base62.encode(Number(res.id))}`))
          ;
        });
      }
    } catch (err) { console.error(err); }
  };

  return {
    errorMessage,
    createBallot,
    setBallotName,
    setAdminCode,
    setVoteCode,
    addSuggestion,
    suggestions
  };
};

export default useSetup;