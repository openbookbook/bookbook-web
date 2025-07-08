
/** @param {Record<string, number>[]} results */
export function parseWinner(results) {
  // get last round
  const lastRound = results[results.length - 1];
  // get highest score in last round
  const maxScore = Math.max(...Object.values(lastRound));
  // return all keys with that highest score
  return Object.keys(lastRound).filter(key => lastRound[key] === maxScore);
}

/**
 * @param {string[]} candidates
 * @param {string[][]} votes
 */
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
    /** @type {Record<string, number>} */
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

    // check the isOver conditions: (1) everyone remaining is tied, (2) someone has more than 50% of the (remaining) votes, 
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

  return fullResults ? results : parseWinner(results);
}
