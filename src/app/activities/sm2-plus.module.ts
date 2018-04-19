export const WORST = 0;
export const CORRECT = 0.6;
export const BEST = 1;
export const DAY_IN_MINISECONDS = 24 * 60 * 60 * 1000;

const limitNumber = (number, min, max) => {
  let ret = number;
  
  if (number < min) {
    ret = min;
  } else if (number > max) {
    ret = max;
  }

  return ret;
};

const getPercentOverdue = (word, today, performanceRating) => {
  //verificar si hay fecha de ultimo repaso
  if (performanceRating === 0.6){
    if (word.lastAttempt) {
      const calculated = (today - word.lastAttempt) / word.reviewInterval;
      return calculated > 2 ? 2 : calculated;
    } else {
      return 2
    }
  }
  return 1
};

export const calculate = (word, performanceRating, today) => {
  const percentOverDue = getPercentOverdue(word, today, performanceRating);

  const difficulty = limitNumber(
    word.difficulty + (8 - 9 * performanceRating) * percentOverDue / 17,
    0, 
    1
  );

  const difficultyWeight = 3 - 1.7 * difficulty;

  let reviewInterval;

  if (performanceRating === WORST) {
    reviewInterval = Math.round(1 / difficultyWeight / difficultyWeight) || 1;
  } else {
    reviewInterval = 1 + Math.round((difficultyWeight - 1) * percentOverDue);
  }

  return {
    percentOverDue,
    difficulty,
    reviewInterval,
    lastAttempt: today,
    word: word,
  };
};