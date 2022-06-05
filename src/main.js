'use strict';

// import countries from './data.json' assert { type: 'json' };

const buttonStart = document.querySelector('.start_btn');
const infoBox = document.querySelector('.info_box');
const quizBox = document.querySelector('.quiz_box');
const timeText = document.querySelector('.time_text');
const timerSec = document.querySelector('.timer_sec');
const textQuestion = document.querySelector('.que_text');
const curQuestionNo = document.querySelector('.current_que_no');
const allQuestion = document.querySelector('.total_que_no');
const nextButton = document.querySelector('.next_btn');
const resultCointr = document.querySelector('.result_box');
const icon = document.querySelector('.fa-crown');
const completeText = document.querySelector('.complete_text');
const winText = document.querySelector('.win_lose_text');
const correctScore = document.querySelector('.correct_score');
const totalQuestn = document.querySelector('.total_poss_que');
const btn = document.querySelector('.buttons');
const restartGame = document.querySelectorAll('.restart');
const quitGame = document.querySelectorAll('.quit');
const options = document.querySelectorAll('.option');

// ALL FUNCTIONS
const removeOpacity = function (element) {
  element.style.opacity = 100;
  element.style.pointerEvents = 'auto';
};

const addOpacity = function (element) {
  element.style.opacity = 0;
  element.style.pointerEvents = 'none';
};
const generateRand = function (max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomizeArray = function (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

// FUNCTION QUESTIONS
let countries = [];
let choices = [];
let countryList = [];
let cityList = [];
let countryToCity;
let questionCounter = 0;
let questions = [{}];
let score = 0;
let timer;
let correctQuestions = 0;
const SCORE_POINTS = 100;
let bisGameOn = true;

const MAX_QUESTIONS = questions.length;

const startGame = () => {
  bisGameOn = true;
  questionCounter = 0;
  score = 0;
  correctQuestions = 0;
  curQuestionNo.textContent = '';
  allQuestion.textContent = '';
};

(function () {
  // CREATE A NEW MAP ARRAY FOR COUNTRIES AND CITIES
  fetch('./data.json')
    .then(res => res.json())
    .then(count => {
      countries = count;
      countryList = count.map(country => country.country);
      cityList = count.map(country => country.city);
      questions = count.map(que => {
        return {
          question: que.country,
          city: que.city,
        };
      });
    });
})();

const displayQuestions = function () {
  if (questions.length == 0 || questionCounter > countryList.length) {
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign('/end.html');
  }

  questionCounter++;

  curQuestionNo.textContent = `${questionCounter}`;

  allQuestion.textContent = `${questions.length}`;

  //UPDATE QUESTION
  let questionIndex = questions[generateRand(1, questions.length)];
  textQuestion.textContent = `What is the capital of ${questionIndex.question}?`;

  countryToCity = countries.find(ctr => ctr.country === questionIndex.question);

  // RANDOMLY SELECTED OPTIONS

  choices = [
    questionIndex.city,
    cityList[generateRand(1, cityList.length)],
    cityList[generateRand(1, cityList.length)],
    cityList[generateRand(1, cityList.length)],
  ];
  randomizeArray(choices);

  options.forEach((el, i) => {
    el.innerHTML = choices[i];
    // el.insertAdjacentText('afterbegin', choices[i]);
  });
};

const questionTimer = function () {
  const tick = function () {
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    timerSec.textContent = `${sec}`;

    // When 0 seconds, stop timer and change question
    if (time === 0) {
      if (bisGameOn) {
        // clearInterval(timer);
        displayQuestions();
      } else if (!bisGameOn) {
        clearInterval(timer);
      }
      if (timer) clearInterval(timer);
      timer = questionTimer();
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 7;

  // Call the timer every second
  tick();
  timer = setInterval(tick, 1000);

  return timer;
};

// CHECK ANSWER

const checkAnswer = function () {
  options.forEach((el, i) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const selectedChoice = e.target;

      if (selectedChoice.textContent === countryToCity.city) {
        //   const selectedAnswer = selectedChoi;
        selectedChoice.style.backgroundColor = 'green';

        // if (bisGameOn) {
        score += SCORE_POINTS;
        ++correctQuestions;
        // }

        setTimeout(() => {
          selectedChoice.style.backgroundColor = '';
          if (score < 1000 && bisGameOn) {
            displayQuestions();
          } else if (score >= 200) {
            score = 0;
            bisGameOn = false;
            removeOpacity(resultCointr);
            addOpacity(quizBox);
            addOpacity(infoBox);
            correctScore.textContent = `${correctQuestions}`;
            totalQuestn.textContent = `${questionCounter}`;
          }

          if (timer) clearInterval(timer);
          timer = questionTimer();
        }, 1000);
      } else if (selectedChoice.textContent !== countryToCity.city) {
        selectedChoice.style.backgroundColor = 'red';

        setTimeout(() => {
          selectedChoice.style.backgroundColor = '';
          if (score < 1000 && bisGameOn) {
            displayQuestions();
          }

          if (timer) clearInterval(timer);
          timer = questionTimer();
        }, 1000);
      }
    });
  });
};

// ALL EVENT CALL BACK FUNCTIONS

buttonStart.addEventListener('click', function (e) {
  e.preventDefault();
  removeOpacity(infoBox);
});

quitGame.forEach((e, i) =>
  e.addEventListener('click', function (e) {
    e.preventDefault();
    addOpacity(infoBox);
    addOpacity(quizBox);
    addOpacity(resultCointr);
    // startGame();
  })
);

restartGame.forEach(e => {
  e.addEventListener('click', function (e) {
    e.preventDefault();
    if (timer) clearInterval(timer);
    timer = questionTimer();
    removeOpacity(quizBox);
    addOpacity(resultCointr);
    startGame();
    displayQuestions();
  });
});

nextButton.addEventListener('click', function (e) {
  e.preventDefault();
  if (timer) clearInterval(timer);
  timer = questionTimer();
  displayQuestions();
  // checkAnswer();
});
checkAnswer();
