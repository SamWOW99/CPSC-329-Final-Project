// Initial variables
let currentQuestion = 0;
let currentScore = 0;
let highScore = 0;

// randomly shuffles the results of any array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

// displays the highScore after a game is played.
// No highscore displayed when highScore == 0.
function displayHighScore(){

}

// displays a question from a shuffled array
function displayQuestion(){
    
}