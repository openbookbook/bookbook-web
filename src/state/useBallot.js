import { useCallback, useEffect, useState } from 'react';
import { getBallot, completeBallot, upsertVote } from '../utils/backend-api';
import { getBook } from '../utils/gbooks-api';
import { base62, groupByKey, relocateItemInArray, shuffleArray } from '../utils/utils';
import { rankedChoiceVote } from '../utils/voting-methods';

/** @typedef {import('../utils/backend-api').Election} Election */
/** @typedef {import('../utils/backend-api').Candidate} Candidate */
/** @typedef {import('../utils/backend-api').Vote} Vote */
/** @typedef {import('./useGoogleBooks').Book} Book */

/** @param {string} idFromUrl */
const useBallot = idFromUrl => {
  const [candidates, setCandidates] = useState(/** @type {(Candidate & { info?: Book })[]} */([]));
  const [currentRanking, setCurrentRanking] = useState(/** @type {(Candidate & { info?: Book })[]} */([]));
  const [election, setElection] = useState(/** @type {Election | null} */(null));
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [winners, setWinners] = useState(/** @type {string[]} */([]));

  useEffect(() => {
    if (!loading) return;

    getBallot(base62.decode(idFromUrl))
      .then(async ballot => {
        setElection(ballot);

        const candidates = ballot.candidates || [];
        if (candidates?.some(c => c.kind === 'book')) {
          Promise.all(
            candidates.map(async book => {
              const info = await getBook(book.googleBooksId || '');

              return { ...book, info };
            })
          ).then(books => {
            setCandidates(books);
            setCurrentRanking(shuffleArray(books));
          });
        } else {
          setCandidates(candidates);
          setCurrentRanking(shuffleArray(candidates));
        }
      })
      .finally(() => setLoading(false));
    ;
  }, [idFromUrl, loading]);

  // if ballot has .endDate set, calculate the winners
  useEffect(() => {
    const votes = election?.candidates?.map(cand => cand.votes.map(vote => ({ ...vote, candidateId: cand.id }))).flat() || [];

    if (election?.isCompleted && candidates?.length && votes?.length) {
      const groupedVotes = Object.values(groupByKey(votes, 'author'))
        .map(votes => [...votes].sort((a, b) => b.score - a.score))
        .map(votes => votes.map(vote => vote.candidateId))
      ;
      console.log(Object.values(groupByKey(votes, 'author')))
      const winners = rankedChoiceVote(candidates.map(candidate => candidate.id), groupedVotes);
      setWinners(winners);
    }
  }, [candidates, election?.isCompleted, election?.votes]);

  const endVote = useCallback(() => {
    if (!election?.id || !idFromUrl) return;

    completeBallot({ id: election.id, isCompleted: true }).then(setElection);
  }, [idFromUrl, election]);

  const handleRankingChange = useCallback(
    /** @param {number} oldIndex; @param {number} newIndex */
    (oldIndex, newIndex) => {
      const newRanking = relocateItemInArray(currentRanking.map(c => c.id), oldIndex, newIndex);
      setCurrentRanking(
        newRanking.map(id => /** @type {Candidate} */(currentRanking.find(c => c.id === id)))
      );
    },
    [currentRanking]
  );

  const handleSaveBallot = useCallback(
    async () => {
      console.count('handleSaveBallot');

      const electionId = election?.id;
      if (!electionId) return;

      const ballotVotes = currentRanking.map((candidate, i) => {
        const score = (1 - (i / (currentRanking.length - 1))) || 0;

        return ({
          author: username,
          candidate: { id: candidate.id },
          candidateId: candidate.id,
          election: { id: electionId },
          electionId,
          score,
        });
      });

      console.log({ currentRanking, username, ballotVotes });

      Promise.all(ballotVotes.map(upsertVote)).then(() => setLoading(true));
    },
    [currentRanking, election?.id, username]
  );

  return {
    candidates,
    currentRanking,
    election,
    endVote,
    handleRankingChange,
    handleSaveBallot,
    loading,
    setUsername,
    username,
    votes: election?.votes || [],
    winners,
  };
};

export default useBallot;
