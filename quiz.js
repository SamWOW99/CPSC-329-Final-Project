// Initial variables
let currentQuestion = 0;
let currentScore = 0;
let highScore = 0;
let time;

let quizData = [];
let timer;
let mode = 1;
let timeLeft = 10000;

let multiplier = 1;

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
    highscore.innerHTML = "Highscore: " + highScore;
  }
}

// displays the score current score
function UpdateScore(){
  //let questionScore = Math.floor(timeLeft/timer * 100 * mode);
  //currentScore = currentScore + questionScore;
  //currentQuestion = currentQuestion + 1;
  
  // Sam's version
  let questionScore = Math.floor(timeLeft/timer * 100 * multiplier);
  currentScore += questionScore;
  currentQuestion ++;

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
    DisplayWrongAnswer();
  }

  timeLeft = timeLeft - 100;
}

function DisplayWrongAnswer(){
  clearInterval(time);
  DisplayResults();
}

function DisplayResults(){
  clearInterval(time);
  quizContainer.innerHTML = "";

  const msg = document.createElement('h1');
  msg.className = 'title';
  msg.innerHTML = 'Thanks for playing! Your score was: ' + currentScore + '!';
  const msg2 = document.createElement('h2');
  msg2. className = 'title';
  msg2.innerHTML = 'You answered ' + currentQuestion + ' out of ' + quizData.length + ' questions.';
  const buttons = document.createElement('div');
  buttons.className = 'buttons';
  var newMode = document.createElement('button');
  newMode.className = 'button';
  newMode.innerHTML = 'New Mode';
  var retry = document.createElement('button');
  retry.className = 'button';
  retry.innerHTML = 'Retry';

  buttons.appendChild(retry);
  //buttons.appendChild(newMode);

  retry.addEventListener('click', reset);

  quizContainer.appendChild(msg);
  quizContainer.appendChild(msg2);
  quizContainer.appendChild(buttons);

  if(currentScore > highScore){
    highscore = currentScore;
  }
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
      multiplier = parseInt(questionData.multiplier);
      console.log(multiplier);
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
  currentScore = 0;
  currentQuestion = 0;
  quiz();
}

// Quiz data is taken from both easy and medium questions
function mediumQuiz(){
  quizData = easyQuestions.concat(mediumQuestions);
  shuffleArray(quizData);
  mode = 2;
  timer = 11000;
  currentScore = 0;

  currentQuestion = 0;
  quiz();
}

// Quiz data is taken from all question banks
function hardQuiz(){
  quizData = easyQuestions.concat(mediumQuestions).concat(hardQuestions);
  shuffleArray(quizData);
  mode = 3;
  timer = 7000;
  currentScore = 0;
  
  //Reset current question at begining of each quiz
  currentQuestion = 0;
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
  displayHighScore();
}

easyButton.addEventListener('click', easyQuiz);
mediumButton.addEventListener('click', mediumQuiz);
hardButton.addEventListener('click', hardQuiz);