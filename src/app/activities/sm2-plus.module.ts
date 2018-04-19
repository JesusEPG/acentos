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

/*
--------------------------------------------------------------------------------------------------------------
  const WORST = 0;
const CORRECT = 0.6;
const INCORRECT = 0.3;
const BEST = 1;
const DAY_MILLIS: 1000*60*60*24;
const TEN_MINUTES_IN_DAYS: 0.007;

const NOW = () => new Date();

const limitNumber = (number, min, max) => {
  let ret = number;
  
  if (number < min) {
    ret = min;
  } else if (number > max) {
    ret = max;
  }

  return ret;
};*/

/**
  *  Retorna la cantidad de días entre hoy y la fecha recibida
*/
/*const daysBetweenTodayAndAnotherDate = (date) => {
  return (NOW().getTime() - date.getTime()) / DAY_MILLIS;
};*/

/**
  *  Retorna la dificultad en base a la dificultad anterior,
  *  el porcentaje de atraso y el desempeño
*/
/*const updateDifficulty = (prevDifficulty, percentOverDue, performanceRating) => {
  //return prevDifficulty + (percentOverDue * 1/17 * (8-9 * performanceRating))
  return limitNumber(
            prevDifficulty + (percentOverDue * 1/17 * (8-9 * performanceRating)),
            0, 
            1
          );
  };*/

/**
  *  Retorna el peso de dificultad en base a la dificultad
*/
/*const calcDifficultyWeight = (difficulty) => {
  return 3 - 1.7 * difficulty;
}*/

/**
  *  Retorna el porcentaje de atraso del ejercicio
  *  Tomando en cuenta la fecha del ultimo repaso y los días dados para revisar
  *
  *  Cuanto más alto el valor más atrasado
*/
/*const getPercentOverDue = (activity) => {
  if (activity.lastAttempt && activity.reviewInterval) {
    let days = daysBetweenTodayAndAnotherDate(activity.lastAttempt);
    return Math.min(2, days / activity.reviewInterval);
  } else {
      return 1
    }
};*/

/*const calcDaysBetweenReviews = (reviewInterval, difficultyWeight, performanceRating, percentOverDue) => {
  if(performanceRating < CORRECT)
    return Math.max(reviewInterval * (1/Math.pow(difficultyWeight, 2)), 1)
    //return TEN_MINUTES_IN_DAYS; //Se errou, rever em 10 minutos
  else
    return reviewInterval * (1 + (difficultyWeight - 1) * percentOverDue)
};

const review = (activity, performanceRating) => {
  let percentOverDue = getPercentOverDue(activity);
  let difficulty = updateDifficulty(activity.difficulty, percentOverDue, performanceRating);
  let difficultyWeight = calcDifficultyWeight(difficulty);
  let reviewInterval = calcDaysBetweenReviews(activity.reviewInterval, difficultyWeight, performanceRating, percentOverDue);

  activity.updateByReview(difficulty, percentOverDue, reviewInterval, NOW());
  return activity;
};*/

/*const getPercentOverdue = (word, today, performanceRating) => {
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
};*/

/*const calculate = (word, performanceRating, today) => {
  const percentOverDue = getPercentOverdue(word, today);

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
    difficulty,
    reviewInterval,
    lastAttempt: today,
    word: word.word,
  };
};*/