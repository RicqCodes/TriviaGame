'use strict';

import countries from './data.json' assert { type: 'json' };

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
const restartGame = document.querySelector('.restart');
const quitGame = document.querySelector('.quit');
const options = document.querySelectorAll('.option');
const correctTick = document.querySelector('.icon.tick');
const wrongTick = document.querySelector('.cross');

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
let choices = [];
let countryList = [];
let cityList = [];
let countryToCity;
let questionCounter = 0;
let questions = [{}];
let score = 0;
let correctQuestions = 0;
const SCORE_POINTS = 100;

const MAX_QUESTIONS = questions.length;

const startGame = () => {
  questionCounter = 0;
  score = 0;
};

// CREATE A NEW MAP ARRAY FOR COUNTRIES AND CITIES
countryList = countries.map(country => country.country);
cityList = countries.map(country => country.city);
questions = countries.map(que => {
  return {
    question: que.country,
    city: que.city,
  };
});

const displayQuestions = function () {
  //   if (questions.length == 0 || questionCounter > MAX_QUESTIONS) {
  //     localStorage.setItem('mostRecentScore', score);
  //     return window.location.assign('/end.html');
  //   }

  ++questionCounter;

  curQuestionNo.textContent = `${questionCounter}`;
  allQuestion.textContent = `${questions.length}`;

  //UPDATE QUESTION
  let questionIndex = questions[generateRand(1, countryList.length)];
  textQuestion.textContent = `What is the capital of ${questionIndex.question}?`;

  countryToCity = countries.find(ctr => ctr.country === questionIndex.question);

  console.log(countryToCity);

  // RANDOMLY SELECTED OPTIONS

  choices = [
    countryToCity.city,
    cityList[generateRand(1, cityList.length)],
    cityList[generateRand(1, cityList.length)],
    cityList[generateRand(1, cityList.length)],
  ];
  randomizeArray(choices);

  options.forEach((el, i) => {
    el.textContent = '';
    el.insertAdjacentText('afterbegin', choices[i]);
  });
};

// CHECK ANSWER

const checkAnswer = function () {
  options.forEach((el, i) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const selectedChoice = e.target;
      //   const selectedAnswer = selectedChoi;
      if (selectedChoice.textContent === countryToCity.city) {
        selectedChoice.style.backgroundColor = 'green';

        ++correctQuestions;

        score += SCORE_POINTS;

        console.log(score);

        if (score >= 300) {
          removeOpacity(resultCointr);
          addOpacity(quizBox);
          addOpacity(infoBox);
          correctScore.textContent = `${correctQuestions}`;
          totalQuestn.textContent = `${questionCounter}`;
        }

        setTimeout(() => {
          selectedChoice.style.backgroundColor = '';
          displayQuestions();
        }, 1000);
        console.log('correct answer');
      } else {
        selectedChoice.style.backgroundColor = 'red';
        setTimeout(() => {
          selectedChoice.style.backgroundColor = '';
          displayQuestions();
        }, 1000);
        console.log('wrong answer');
      }
      console.log(selectedChoice);
    });
  });
};
console.log(options);

// ALL EVENT CALL BACK FUNCTIONS
buttonStart.addEventListener('click', function (e) {
  e.preventDefault();
  removeOpacity(infoBox);
});

quitGame.addEventListener('click', function (e) {
  e.preventDefault();
  addOpacity(infoBox);
});

restartGame.addEventListener('click', function (e) {
  e.preventDefault();
  removeOpacity(quizBox);
  startGame();
  displayQuestions();
  checkAnswer();
});

nextButton.addEventListener('click', function (e) {
  e.preventDefault();
  displayQuestions();
  checkAnswer();
});
