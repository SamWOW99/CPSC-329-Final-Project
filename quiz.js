// Initial variables
let currentQuestion = 0;
let currentScore = 0;
let highScore = 0;
let time;

let quizData = [];
let timer;
let timeUp;
let mode;

// Document elements
const quizContainer = document.getElementById('quiz');
const highscore = document.getElementById('highscore');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const beforeQuiz = document.getElementById('beforeQuiz');

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
  currentQuestion = currentQuestion + 1;
  quiz();
}

function DisplayResults(){

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
      option.addEventListener('click', DisplayResults);
    }
    option.innerHTML = shuffledOptions[i];
    /*
    const option = document.createElement('label');
    option.className = 'option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'quiz';
    radio.value = shuffledOptions[i];

    const optionText = document.createTextNode(shuffledOptions[i]);

    option.appendChild(radio);
    option.appendChild(optionText);*/
    optionsElement.appendChild(option);
  }

  questionContainer.innerHTML = '';
  questionContainer.appendChild(questionElement);
  questionContainer.appendChild(optionsElement);

}

// Resets the screen to normal
function reset(){
  beforeQuiz.style.display = 'flex';
  quizContainer.style.display = 'none';
}

// Quiz data is taken from easy questions
function easyQuiz(){
  quizData = easyQuestions;
  shuffleArray(quizData);
  mode = 1;
  timer = 20;
  quiz();
}

// Quiz data is taken from both easy and medium questions
function mediumQuiz(){
  quizData = easyQuestions.concat(mediumQuestions);
  shuffleArray(quizData);
  mode = 2;
  timer = 15;
  quiz();
}

// Quiz data is taken from all question banks
function hardQuiz(){
  quizData = easyQuestions.concat(mediumQuestions).concat(hardQuestions);
  shuffleArray(quizData);
  mode = 3;
  timer = 10;
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
  score.innerHTML = 'Current score:';

  const questionContainer = document.createElement('div');
  questionContainer.className = 'container';

  quizContainer.innerHTML = "";
  quizContainer.appendChild(score);
  quizContainer.appendChild(questionContainer);

  displayQuestion(questionContainer);
}

easyButton.addEventListener('click', easyQuiz);
mediumButton.addEventListener('click', mediumQuiz);
hardButton.addEventListener('click', hardQuiz);