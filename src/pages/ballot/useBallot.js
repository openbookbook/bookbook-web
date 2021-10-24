import { useEffect, useState } from 'react';
import { addUser, getBallot, getSuggestions, getUsers, updateBallot, updateUser } from '../../utils/backend-api';
import { getBook } from '../../utils/gbooks-api';
import { base62, relocateItemInArray, shuffleArray } from '../../utils/utils';
import { rankedChoiceVote } from '../../utils/voting-methods.js';

const votingMethods = {
  'default': rankedChoiceVote,
  'rcv': rankedChoiceVote,
};

const useBallot = idFromUrl => {
  const [ballot, setBallot] = useState(null);
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRanking, setCurrentRanking] = useState([]);

  useEffect(() => {
    if (loading) {
      getBallot(base62.decode(idFromUrl))
        .then(async ballot => {
          // set ballot
          setBallot(ballot);

          // set users
          setUsers(await getUsers(ballot.id));

          // set candidates, get full info from google books
          const cands = await getSuggestions(ballot.id);
          if (!ballot.candidateType || ballot.candidateType === 'book') {
            Promise.all(
              cands.map(async book => book.info ? book : { ...book, info: await getBook(book.googleBooks || book.gbooks || book.id) })
            ).then(books => {
              setCandidates(books);
              setCurrentRanking(shuffleArray(books));
            });
          } else {
            setCandidates(cands);
            setCurrentRanking(shuffleArray(cands));
          }
        })
        .finally(setLoading(false));
      ;
    }
  }, [idFromUrl, loading]);

  // if ballot has .endDate set, calculate the winners
  useEffect(() => {
    if (ballot?.endDate && candidates?.length && users?.length) {
      setWinners(votingMethods[ballot.votingMethod](
        candidates.map(candidate => candidate.id), 
        users.filter(u => u.vote).map(u => u.vote.split(' ')), 
        false
      ));
    }
  }, [ballot?.endDate, ballot?.votingMethod, users, candidates]);

  // when currentUser or currentUser.vote changes, update the list of users
  useEffect(() => {
    if (currentUser) {
      if (!users.map(u => u.id).includes(currentUser.id)) setUsers([...users, currentUser]);
      if (currentUser.vote) setCurrentRanking(currentUser.vote.split(' ').map(id => candidates.find(c => c.id === Number(id))));
    }
  }, [currentUser, users, candidates]);

  // update the user when vote or password changes
  useEffect(() => {
    if (currentUser?.vote || currentUser?.password) updateUser(currentUser);
  }, [currentUser]);

  const endVote = () => {
    const endDate = Date.now().toString();
    
    updateBallot({ ...ballot, endDate }).then(setBallot);
  };

  const signOut = () => setCurrentUser(null);

  const signUp = async user => {
    return await addUser({
      ...user,
      ballotId: ballot.id,
      vote: null
    }).then(user => {
      setCurrentUser(user);
      return user;
    });
  };

  const signIn = credentials => {
    // TODO: make a route for logging in and rewrite this whole function
    const match = users.find(u => u.username === credentials.username);
    if (match && (!match.password || match.password === credentials.password)) {
      setCurrentUser(match);
      return match;
    } else return null;
  };

  const updateVote = () => {
    setCurrentUser({ ...currentUser, vote: currentRanking.map(c => c.id).join(' ') });
    setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
  };

  const handleRankingChange = (oldIndex, newIndex) => {
    const newRanking = relocateItemInArray(currentRanking.map(c => c.id), oldIndex, newIndex);
    setCurrentRanking(newRanking.map(id => currentRanking.find(c => c.id === id)));
  };

  return { 
    loading, ballot, currentUser, 
    users, candidates, winners, 
    endVote, signOut, signUp, 
    signIn, currentRanking, updateVote,
    handleRankingChange
  };
};

export default useBallot;
