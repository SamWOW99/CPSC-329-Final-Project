// Initial variables
let currentQuestion = 0;
let currentScore = 0;
let highScore = 0;
let time;
let fade;
let timerPaused = true; // Flag to pause the timer initially
let wrongAnswer = true; // Flag to determine if time ran out or wrong choice was selected

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

  if(timer > 5){
    timer = timer * 0.95;
  }
  //console.log("currentQuestion: ",currentQuestion,"\nquizData.length: ", quizData.length);

  if(currentQuestion<quizData.length){
    quiz();
  }
  else{
    DisplayResults();
  }
}

function TimeBarDecrease(timeToDo){
  if (!timerPaused) {
    if(timeLeft<0){
      timeLeft = timeToDo;
    }
    const leftBar = document.createElement('div');
    const rightBar = document.createElement('div');

    leftBar.style.display = 'inline-block';
    rightBar.style.display = 'inline-block';

    let percent = timeLeft/timeToDo * 100;

    leftBar.style.width = percent + "%";
    rightBar.style.width = 100 - percent + "%";
    leftBar.style.height = "20px";
    rightBar.style.height = "20px";
    leftBar.style.backgroundColor = "#f6442f";
    rightBar.style.backgroundColor = "#3b1f2b";

    timerBar.innerHTML = "";
    timerBar.appendChild(leftBar);
    timerBar.appendChild(rightBar);

    if(timeLeft < 100){
      timeLeft = -1;
      wrongAnswer = false;
      clearInterval(time);
      DisplayWrongAnswer();
    }

    timeLeft -= 100;
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
  quizContainer.innerHTML = "";
  quizContainer.className = 'container';
  const questionData = quizData[currentQuestion];

  const msg = document.createElement('h1');
  msg.className = 'title';
  if(wrongAnswer){
    msg.innerHTML = 'Wrong Answer. The correct answer was: ';
  }
  else {
    msg.innerHTML = 'Out of Time. The correct answer was: ';
  }
  wrongAnswer = true;
  const msg2 = document.createElement('h2');
  msg2. className = 'title';
  msg2.innerHTML = questionData.answer;
  const msg3 = document.createElement('p');
  msg3.innerHTML = questionData.explanation;
  const buttons = document.createElement('div');
  buttons.className = 'buttons';
  var next = document.createElement('button');
  next.className = 'button';
  next.innerHTML = 'Next';

  buttons.appendChild(next);
  next.addEventListener('click', DisplayResults);

  quizContainer.appendChild(msg);
  quizContainer.appendChild(msg2);
  quizContainer.appendChild(msg3);
  quizContainer.appendChild(buttons);
  //DisplayResults();
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
  //clearInterval(time);
  timeLeft = -1;
  const questionData = quizData[currentQuestion];

  console.log(questionData.answer);
  const questionElement = document.createElement('div');
  questionElement.style.marginBottom = '30px';
  questionElement.className = 'question';
  questionElement.innerHTML = questionData.question;

  questionContainer.innerHTML = '';
  questionContainer.appendChild(questionElement);
  

  timerBar.style.display = 'flex'; // Set the initial display style for the timer bar
  timerBar.style.width = '90%'; // Adjust width if needed

  let optionsDisplayed = false;

  // Delay displaying the options for 5 seconds (5000 milliseconds)
  setTimeout(() => {
    if (!optionsDisplayed) {
  
      const optionsElement = document.createElement('div');
      optionsElement.className = 'options';

      const shuffledOptions = [...questionData.options];
      //shuffleArray(shuffledOptions);

      for (let i = 0; i < shuffledOptions.length; i++) {
        var option = document.createElement('button');
        option.className = 'option';

        if(shuffledOptions[i] == questionData.answer){
          multiplier = parseInt(questionData.multiplier);
          option.addEventListener('click', () => {
            timerPaused = true; // Pause the timer after a correct answer
            UpdateScore();
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
      timerPaused = false; // Unpause the timer
      
    }
  }, 5000); // 5 seconds delay before displaying options
}

// Quiz data is taken from easy questions
function easyQuiz(){
  quizData = easyQuestions;
  shuffleArray(quizData);
  mode = 1;
  timer = 25000;
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
  quizContainer.className = "";
  quizContainer.appendChild(score);
  quizContainer.appendChild(timerBar);
  quizContainer.appendChild(questionContainer);
  
  clearInterval(time);
  time = setInterval(TimeBarDecrease, 100, timer);

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