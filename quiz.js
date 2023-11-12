// Initial variables
let currentQuestion = 0;
let currentScore = 0;
let highScore = 0;
let time;

let quizData = [];
let timer;
let mode = 1;
let timeLeft = 10000;

// Document elements
const quizContainer = document.getElementById('quiz');
const highscore = document.getElementById('highscore');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const beforeQuiz = document.getElementById('beforeQuiz');
const timerBar = document.createElement('div');

// randomly shuffles the results of any array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

// displays the highscore after a game. Does not show anything
// if highscore == 0.
function displayHighScore(){
  if (highScore > 0){
    highscore.style.display = block;
  }
}

// displays the score current score
function UpdateScore(){
  let questionScore = Math.floor(timeLeft/timer * 100 * mode);
  currentScore = currentScore + questionScore;
  currentQuestion = currentQuestion + 1;

  timer = timer * 0.95;
  if(currentQuestion<quizData.length){
    quiz();
  }
  else{
    DisplayResults();
  }
}

function UpdateTimer(){
  const leftBar = document.createElement('div');
  const rightBar = document.createElement('div');

  leftBar.style.display = 'inline-block';
  rightBar.style.display = 'inline-block';

  let percent = timeLeft/timer * 100;

  leftBar.style.width = percent + "%";
  rightBar.style.width = 100 - percent + "%";
  leftBar.style.height = "20px";
  rightBar.style.height = "20px";
  leftBar.style.backgroundColor = "#f6442f";
  rightBar.style.backgroundColor = "#3b1f2b";

  timerBar.innerHTML = "";
  timerBar.appendChild(leftBar);
  timerBar.appendChild(rightBar);

  if(timeLeft == 0){
    clearInterval(time);
  }

  timeLeft = timeLeft - 100;
}

function DisplayWrongAnswer(){
  clearInterval(time);
}

function DisplayResults(){
  clearInterval(time);
}

// displays a question from a shuffled array
function displayQuestion(questionContainer){
  const questionData = quizData[currentQuestion];

  const questionElement = document.createElement('div');
  questionElement.style.marginBottom = '30px';
  questionElement.className = 'question';
  questionElement.innerHTML = questionData.question;

  const optionsElement = document.createElement('div');
  optionsElement.className = 'options';

  const shuffledOptions = [...questionData.options];
  shuffleArray(shuffledOptions);

  for (let i = 0; i < shuffledOptions.length; i++) {
    var option = document.createElement('button');
    option.className = 'option';

    if(shuffledOptions[i] == questionData.answer){
      option.addEventListener('click', UpdateScore);
    }
    else{
      option.addEventListener('click', DisplayWrongAnswer);
    }
    option.innerHTML = shuffledOptions[i];
    optionsElement.appendChild(option);
  }

  questionContainer.innerHTML = '';
  questionContainer.appendChild(questionElement);
  questionContainer.appendChild(optionsElement);

}

// Quiz data is taken from easy questions
function easyQuiz(){
  quizData = easyQuestions;
  shuffleArray(quizData);
  mode = 1;
  timer = 15000;
  quiz();
}

// Quiz data is taken from both easy and medium questions
function mediumQuiz(){
  quizData = easyQuestions.concat(mediumQuestions);
  shuffleArray(quizData);
  mode = 2;
  timer = 10000;
  quiz();
}

// Quiz data is taken from all question banks
function hardQuiz(){
  quizData = easyQuestions.concat(mediumQuestions).concat(hardQuestions);
  shuffleArray(quizData);
  mode = 3;
  timer = 5000;
  quiz();
}

// Responsible for quiz execution
function quiz(){
  beforeQuiz.style.display = 'none';
  quizContainer.style.display = 'block';
  quizContainer.style.justifyContent = 'center';

  const score = document.createElement('h1');
  score.className = 'title'
  score.style.marginTop = '80px';
  score.style.fontSize = '20px';
  score.innerHTML = 'Current score: ' + currentScore;

  timerBar.style.display = 'flex';
  timerBar.style.width = '90%';

  var questionContainer = document.createElement('div');
  questionContainer.className = 'container';

  quizContainer.innerHTML = "";
  quizContainer.appendChild(score);
  quizContainer.appendChild(timerBar);
  quizContainer.appendChild(questionContainer);

  timeLeft = timer;
  
  clearInterval(time);

  time = setInterval(UpdateTimer, 100);

  displayQuestion(questionContainer);
}

// Resets the screen to normal
function reset(){
  beforeQuiz.style.display = 'flex';
  quizContainer.style.display = 'none';
}

easyButton.addEventListener('click', easyQuiz);
mediumButton.addEventListener('click', mediumQuiz);
hardButton.addEventListener('click', hardQuiz);