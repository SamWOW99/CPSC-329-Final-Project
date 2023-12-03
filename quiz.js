// Initial variables
let currentQuestion = 0;
let currentScore = 0;
let highScore = 0;
let time;
let fade;
let timerPaused = true; // Flag to pause the timer initially

let quizData = [];
let timer;
let mode = 1;
let timeLeft = -1;
let timeLeftFade = -1;

let multiplier = 1;

// Document elements
const quizContainer = document.getElementById('quiz');
const highscore = document.getElementById('highscore');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const beforeQuiz = document.getElementById('beforeQuiz');
const timerBar = document.createElement('div');
timerBar.id = 'timerBar'; // Assign an ID to the timer bar element

// Function to initialize the timer bar
function initializeTimerBar() {
  timerBar.style.display = 'none'; // Hide the timer bar initially
  timerBar.style.backgroundColor = 'gray'; // Set timer bar background color (customize as needed)
  timerBar.style.height = '20px'; // Set timer bar height (customize as needed)

  document.body.appendChild(timerBar);
}


// Call the function to initialize the timer bar
initializeTimerBar();

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
    highScore.innerHTML = "Highscore: " + highScore;
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

function TimeBarDecrease() {
  const timerBar = document.getElementById('timerBar');

  if (!timerPaused) {
    if (timerBar.style.display === 'none') {
      timerBar.style.display = 'block'; // Display the timer bar when timer starts
    }

    const leftBar = document.createElement('div');
    const rightBar = document.createElement('div');

    leftBar.style.display = 'inline-block';
    rightBar.style.display = 'inline-block';

    const percent = (timeLeft / timer) * 100; // Assuming 'timeLeft' and 'timer' are accessible variables

    leftBar.style.width = percent + "%";
    rightBar.style.width = 100 - percent + "%";
    leftBar.style.height = "20px";
    rightBar.style.height = "20px";
    leftBar.style.backgroundColor = "#f6442f";
    rightBar.style.backgroundColor = "#3b1f2b";

    timerBar.innerHTML = "";
    timerBar.appendChild(leftBar);
    timerBar.appendChild(rightBar);

    timeLeft -= 100;
    if (timeLeft < 0) {
      clearInterval(time);
      DisplayWrongAnswer();
    }
  }
}


// Increases opacity in 10 msec intervals
function FadeOut(element, timer){
  if (timeLeftFade < 0){
    timeLeftFade = timer;
  }

  let percent = timeLeftFade/timer * 100;
  element.style.opacity = "" + percent + "%"

  if(timeLeftFade == 0){
    timeLeft = -1;
    clearInterval(fade);
    element.style.opacity = "0%";
  }

  timeLeftFade = timeLeftFade - 10;
}

// Decreases opacity in 10 msec intervals
function FadeIn(element, timer){
  if(timeLeftFade < 0){
    timeLeftFade = timer;
  }

  let percent = 100 - (timeLeftFade/timer * 100);
  element.style.opacity = "" + percent + "%";

  if(timeLeftFade == 0){
    timeLeftFade = -1;
    clearInterval(fade);
    element.style.opacity = "100%";
  }
  timeLeftFade = timeLeftFade - 10;
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
    highScore = currentScore;
  }
}

// displays a question from a shuffled array
function displayQuestion(questionContainer) {
  timeLeft = -1;
  const questionData = quizData[currentQuestion];

  console.log(questionData.answer);
  const questionElement = document.createElement('div');
  questionElement.style.marginBottom = '30px';
  questionElement.className = 'question';
  questionElement.innerHTML = questionData.question;

  questionContainer.innerHTML = '';
  questionContainer.appendChild(questionElement);

  let optionsDisplayed = false;

  // Delay displaying the options for 5 seconds (5000 milliseconds)
  setTimeout(() => {
    if (!optionsDisplayed) {
      const optionsElement = document.createElement('div');
      optionsElement.className = 'options';

      const shuffledOptions = [...questionData.options];
      // shuffleArray(shuffledOptions);

      for (let i = 0; i < shuffledOptions.length; i++) {
        var option = document.createElement('button');
        option.className = 'option';

        if (shuffledOptions[i] == questionData.answer) {
          multiplier = parseInt(questionData.multiplier);
          option.addEventListener('click', () => {
            UpdateScore();
            timerPaused = true; // Pause the timer after a correct answer
          });
        } else {
          option.addEventListener('click', DisplayWrongAnswer);
        }
        option.innerHTML = shuffledOptions[i];
        optionsElement.appendChild(option);
      }

      questionContainer.appendChild(optionsElement);
      fade = setInterval(FadeIn, 10, questionContainer, 500);

      optionsDisplayed = true;

      // Start timer countdown after options are displayed
      timeLeft = timer; // Set timeLeft based on the timer duration
      timerPaused = false; // Unpause the timer

      // Initiate the timer after options are displayed
      clearInterval(time);
      time = setInterval(() => {
        TimeBarDecrease();
        if (timeLeft < 0) {
          clearInterval(time);
          DisplayWrongAnswer();
        }
      }, 100);
    }
  }, 5000); // 5 seconds delay before displaying options
}

// Quiz data is taken from easy questions
function easyQuiz(){
  quizData = easyQuestions;
  shuffleArray(quizData);
  mode = 1;
  timer = 125000;
  currentScore = 0;
  currentQuestion = 0;
  quiz();
}

// Quiz data is taken from both easy and medium questions
function mediumQuiz(){
  quizData = easyQuestions.concat(mediumQuestions);
  shuffleArray(quizData);
  mode = 2;
  timer = 21000;
  currentScore = 0;

  currentQuestion = 0;
  quiz();
}

// Quiz data is taken from all question banks
function hardQuiz(){
  quizData = easyQuestions.concat(mediumQuestions).concat(hardQuestions);
  shuffleArray(quizData);
  mode = 3;
  timer = 17000;
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
  
  displayQuestion(questionContainer);
}

// Resets the screen to normal
function reset(){
  beforeQuiz.style.display = 'flex';
  quizContainer.style.display = 'none';
  timerPaused = true;
  clearInterval(time);
  displayHighScore();
}

easyButton.addEventListener('click', easyQuiz);
mediumButton.addEventListener('click', mediumQuiz);
hardButton.addEventListener('click', hardQuiz);