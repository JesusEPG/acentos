import * as moment from 'moment';

const DAY_MILLIS = 1000*60*60*24;
const TEN_MINUTES_IN_DAYS = 0.007;
const NOW = () => moment().utc().toDate();

export const WORST = 0;
export const CORRECT = 0.6;
export const BEST = 1;
export const INCORRECT = 0.3;


export const review = (activity, performanceRating) => {
  let percentOverDue = getPercentOverDue(activity);
  let difficulty = updateDifficulty(activity.difficulty, percentOverDue, performanceRating);
  let difficultyWeight = calcDifficultyWeight(difficulty);
  let reviewInterval = calcDaysBetweenReviews(activity.reviewInterval, difficultyWeight, performanceRating, percentOverDue);


  return {
    percentOverDue,
    difficulty,
    reviewInterval,
    lastAttempt: NOW(), //moment
  };
};

/*
  Retorna el porcentaje de atraso del ejercicio
  Tomando en cuenta la fecha del ultimo repaso y los días dados para revisar
  
  Cuanto más alto el valor más atrasado
*/
const getPercentOverDue = (activity) => {

  if(!activity.lastAttempt)
    activity.lastAttempt = NOW();
  if (activity.lastAttempt && activity.reviewInterval) {
    let days = daysBetweenTodayAndAnotherDate(activity.lastAttempt);
    return Math.min(2, days / activity.reviewInterval);
  } else {
      return 1
    }
};

/*
  Retorna la dificultad en base a la dificultad anterior,
  el porcentaje de atraso y el desempeño
*/
const updateDifficulty = (prevDifficulty, percentOverDue, performanceRating) => {
  return limitNumber(
            prevDifficulty + (percentOverDue * 1/17 * (8-9 * performanceRating)),
            0, 
            1
          );
  };

/*
  Retorna la cantidad de días entre hoy y la fecha recibida
*/
const daysBetweenTodayAndAnotherDate = (date) => {
  let newDate = moment(date).utc().toDate();
  return (NOW().getTime() - newDate.getTime()) / DAY_MILLIS;
};

const limitNumber = (number, min, max) => {
  let ret = number;
  
  if (number < min) {
    ret = min;
  } else if (number > max) {
    ret = max;
  }

  return ret;
};

/*
  Retorna el peso de dificultad en base a la dificultad
*/
const calcDifficultyWeight = (difficulty) => {
  return 3 - 1.7 * difficulty;
}

const calcDaysBetweenReviews = (reviewInterval, difficultyWeight, performanceRating, percentOverDue) => {
  if(performanceRating < CORRECT)
    return Math.max(reviewInterval * (1/Math.pow(difficultyWeight, 2)), 1)
  else
    return reviewInterval * (1 + (difficultyWeight - 1) * percentOverDue)
};