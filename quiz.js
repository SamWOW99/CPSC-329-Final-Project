// Initial variables
let currentQuestion = 0;
let currentScore = 0;
let highScore = 0;

// Document elements
const quizContainer = document.getElementById('quiz');
const score = document.getElementById('scores');
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

}

// displays the score obtained. Stays visible after game play.
function UpdateScore(){

}

// displays a question from a shuffled array
function displayQuestion(array){
    
}

// Resets the screen to normal
function reset(){

}

function easyQuiz(){
  beforeQuiz.style.display = 'none';
}

function mediumQuiz(){

}

function hardQuiz(){

}

easyButton.addEventListener('click', easyQuiz);
mediumButton.addEventListener('click', mediumQuiz);
hardButton.addEventListener('click', hardQuiz);