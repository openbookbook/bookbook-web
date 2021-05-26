export function relocateItemInArray(arr, oldIndex, newIndex) {
  /*
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  */

  // Here's a much more complicated, but more memory efficient (faster) one I found online:
  let i, tmp;
  oldIndex = parseInt(oldIndex, 10);
  newIndex = parseInt(newIndex, 10);

  if (oldIndex !== newIndex && 0 <= oldIndex && oldIndex <= arr.length && 0 <= newIndex && newIndex <= arr.length) {
    tmp = arr[oldIndex];
    if (oldIndex < newIndex) {
      for (i = oldIndex; i < newIndex; i++) {
        arr[i] = arr[i + 1];
      }
    }
    else {
      for (i = oldIndex; i > newIndex; i--) {
        arr[i] = arr[i - 1];
      }
    }
    arr[newIndex] = tmp;
  }

  return arr;
}

export function formatVotes(votes) {
  return votes.map(vote => vote.vote.split(' '));
}

export function parseWinner(results) {
  const lastRound = results[results.length - 1];
  const maxScore = Math.max(...Object.values(lastRound));
  return Object.keys(lastRound).filter(key => lastRound[key] === maxScore);
}

export function rankedChoiceVote(candidates, votes) {
  /*
  ==INPUT==
  candidates is an array of suggestion ids like:
    ['id1', 'id2', 'id3', 'id4']

  votes is an array of arrays. Each inner array represents someone's vote
    [
      ['id3', 'id4', 'id2', 'id1'],
      ['id1', 'id4', 'id3', 'id2'],
      ['id4', 'id3', 'id1', 'id2'],
      ['id4', 'id3', 'id2', 'id1'],
      ['id2', 'id1', 'id3', 'id4'],
      ['id3', 'id1', 'id2', 'id4'],
      ['id1', 'id2', 'id4', 'id3'],
      ['id3', 'id2', 'id1', 'id4']
    ];
  
  ==OUTPUT==
  an array of objects. each object represents a round of voting
  [
    {
      id1: 2,
      id2: 1,
      id3: 3,
      id4: 2
    },
    {
      id1: 3,
      id3: 3,
      id4: 2
    },
    {
      id1: 3,
      id3: 5
    }
  ]
  */

  // keep track of every round
  const results = [];

  const dropped = [];
  let isOver = false;
  while (!isOver) {
    // create the result object and initialize all its keys to suggestions that haven't been dropped and all its values to 0
    const result = {};
    candidates.forEach(suggestion => {
      if (!dropped.includes(suggestion)) result[suggestion] = 0;
    });

    // loop through each vote until you find the first suggestion that wasn't dropped and tally that in the result object
    votes.forEach(vote => {
      for (let suggestion of vote) {
        if (Object.keys(result).includes(suggestion)) {
          result[suggestion]++;
          break;
        }
      }
    });

    // now we have our votes tallied. We just need to drop the lowest one(s) by adding them to the dropped array
    Object.keys(result).forEach(key => {
      if (result[key] === Math.min(...Object.values(result))) dropped.push(key);
    });

    // check the isOver conditions: (1) everyone is tied, (2) someone has more than 50% of the (remaining) votes, 
    if (Object.values(result).every(val => val === Object.values(result)[0])) isOver = true;
    else {
      const topScore = Math.max(...Object.values(result));
      const totScore = Object.values(result).reduce((acc, val) => acc + val, 0);
      if (topScore > (totScore / 2)) isOver = true;
    }

    // keep a record of each round
    results.push(result);

    // in case we're stuck in an infinite loop:
    if (results.length > 999) break;
  }

  return results;
}